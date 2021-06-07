import os
import logging
import argparse
from tqdm import tqdm, trange
import time
import sys

import numpy as np
import torch
from torch.utils.data import TensorDataset, DataLoader, SequentialSampler
from transformers import ElectraForTokenClassification

from utils import init_logger, load_tokenizer
from processors import get_labels

from konlpy.tag import Mecab

import pymysql
import json

logger = logging.getLogger(__name__)

with open(r'./config.json', 'r') as f:
    config = json.load(f)

def get_device(pred_config):
    return "cuda" if torch.cuda.is_available() and not pred_config.no_cuda else "cpu"

def get_args(pred_config):
    return torch.load(os.path.join(pred_config.output_dir, 'training_args.bin'))

def load_model(pred_config, args, device):
    # Check whether model exists
    if not os.path.exists(pred_config.output_dir):
        raise Exception("Model doesn't exists! Train first!")

    try:
        # Config will be automatically loaded from output_dir
        model = ElectraForTokenClassification.from_pretrained(args.output_dir)
        model.to(device)
        model.eval()
        logger.info("***** Model Loaded *****")
    except:
        raise Exception("Some model files might be missing...")

    return model


def read_input_file(pred_config, curs, conn):
    lines = []
    with open(pred_config.input_file, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            words = line.split()
            lines.append(words)

        sql = f'INSERT INTO SENTENCE SELECT "{userid}", (SELECT COUNT(*) FROM SENTENCE WHERE Uid="{userid}"), NOW(), "{line}", ""'
        curs.execute(sql)
        conn.commit()

    return lines


def convert_input_file_to_tensor_dataset(lines,
                                         pred_config,
                                         args,
                                         tokenizer,
                                         pad_token_label_id,
                                         cls_token_segment_id=0,
                                         pad_token_segment_id=0,
                                         sequence_a_segment_id=0,
                                         mask_padding_with_zero=True):
    # Setting based on the current model type
    cls_token = tokenizer.cls_token
    sep_token = tokenizer.sep_token
    unk_token = tokenizer.unk_token
    pad_token_id = tokenizer.pad_token_id

    all_input_ids = []
    all_attention_mask = []
    all_token_type_ids = []
    all_slot_label_mask = []

    for words in lines:
        tokens = []
        slot_label_mask = []
        for word in words:
            word_tokens = tokenizer.tokenize(word)
            if not word_tokens:
                word_tokens = [unk_token]  # For handling the bad-encoded word
            tokens.extend(word_tokens)
            # Use the real label id for the first token of the word, and padding ids for the remaining tokens
            slot_label_mask.extend(
                [0] + [pad_token_label_id] * (len(word_tokens) - 1))

        # Account for [CLS] and [SEP]
        special_tokens_count = 2
        if len(tokens) > args.max_seq_len - special_tokens_count:
            tokens = tokens[: (args.max_seq_len - special_tokens_count)]
            slot_label_mask = slot_label_mask[:(
                args.max_seq_len - special_tokens_count)]

        # Add [SEP] token
        tokens += [sep_token]
        token_type_ids = [sequence_a_segment_id] * len(tokens)
        slot_label_mask += [pad_token_label_id]

        # Add [CLS] token
        tokens = [cls_token] + tokens
        token_type_ids = [cls_token_segment_id] + token_type_ids
        slot_label_mask = [pad_token_label_id] + slot_label_mask

        input_ids = tokenizer.convert_tokens_to_ids(tokens)

        # The mask has 1 for real tokens and 0 for padding tokens. Only real tokens are attended to.
        attention_mask = [1 if mask_padding_with_zero else 0] * len(input_ids)

        # Zero-pad up to the sequence length.
        padding_length = args.max_seq_len - len(input_ids)
        input_ids = input_ids + ([pad_token_id] * padding_length)
        attention_mask = attention_mask + \
            ([0 if mask_padding_with_zero else 1] * padding_length)
        token_type_ids = token_type_ids + \
            ([pad_token_segment_id] * padding_length)
        slot_label_mask = slot_label_mask + \
            ([pad_token_label_id] * padding_length)

        all_input_ids.append(input_ids)
        all_attention_mask.append(attention_mask)
        all_token_type_ids.append(token_type_ids)
        all_slot_label_mask.append(slot_label_mask)

    # Change to Tensor
    all_input_ids = torch.tensor(all_input_ids, dtype=torch.long)
    all_attention_mask = torch.tensor(all_attention_mask, dtype=torch.long)
    all_token_type_ids = torch.tensor(all_token_type_ids, dtype=torch.long)
    all_slot_label_mask = torch.tensor(all_slot_label_mask, dtype=torch.long)

    dataset = TensorDataset(all_input_ids, all_attention_mask,
                            all_token_type_ids, all_slot_label_mask)

    return dataset


def predict(pred_config):

    conn = pymysql.connect(host=config['mysql']['host'], user=config['mysql']['user'], password=config['mysql']['password'], db=config['mysql']['database'])
    curs = conn.cursor()
    sql = f'SELECT COUNT(*) FROM SENTENCE WHERE Uid="{userid}"'
    curs.execute(sql)
    Wnumber = curs.fetchone()[0]

    # load model and args
    args = get_args(pred_config)
    device = get_device(pred_config)
    model = load_model(pred_config, args, device)
    label_lst = get_labels(args)
    logger.info(args)

    # Convert input file to TensorDataset
    pad_token_label_id = torch.nn.CrossEntropyLoss().ignore_index
    tokenizer = load_tokenizer(args)
    lines = read_input_file(pred_config, curs, conn)
    dataset = convert_input_file_to_tensor_dataset(
        lines, pred_config, args, tokenizer, pad_token_label_id)

    # Predict
    sampler = SequentialSampler(dataset)
    data_loader = DataLoader(dataset, sampler=sampler,
                             batch_size=pred_config.batch_size)

    all_slot_label_mask = None
    preds = None

    for batch in tqdm(data_loader, desc="Predicting"):
        batch = tuple(t.to(device) for t in batch)
        with torch.no_grad():
            inputs = {"input_ids": batch[0],
                      "attention_mask": batch[1],
                      "labels": None}
            if args.model_type != "distilkobert":
                inputs["token_type_ids"] = batch[2]
            outputs = model(**inputs)
            logits = outputs[0]

            if preds is None:
                preds = logits.detach().cpu().numpy()
                all_slot_label_mask = batch[3].detach().cpu().numpy()
            else:
                preds = np.append(preds, logits.detach().cpu().numpy(), axis=0)
                all_slot_label_mask = np.append(
                    all_slot_label_mask, batch[3].detach().cpu().numpy(), axis=0)

    preds = np.argmax(preds, axis=2)
    slot_label_map = {i: label for i, label in enumerate(label_lst)}
    preds_list = [[] for _ in range(preds.shape[0])]

    for i in range(preds.shape[0]):
        for j in range(preds.shape[1]):
            if all_slot_label_mask[i, j] != pad_token_label_id:
                preds_list[i].append(slot_label_map[preds[i][j]])

    # Write to output file
    with open(pred_config.output_file, "w", encoding="utf-8") as f:
        for words, preds in zip(lines, preds_list):
            line = ""
            Wid = 0
            for word, pred in zip(words, preds):
                if pred == 'O':
                    line = line + word + " "
                else:
                    line = line + "[{}:{}] ".format(word, pred)

            mecab = Mecab()
            str3 = line.strip()

            li = mecab.pos(str3)
            res1 = list(filter(lambda x: li[x][0] == '[', range(len(li))))
            res2 = list(filter(lambda x: li[x][0] == ']', range(len(li))))

            k = 0
            for i in range(0, len(res1)):
                for j in range(res1[i]+1+k, res2[i]+k):
                    ix = res2[i]+1
                    if li[j][1] == 'JKS' or li[j][1] == 'JKC' or li[j][1] == 'JKG' or li[j][1] == 'JKO' or li[j][1] == 'JKB' or li[j][1] == 'JKV' or li[j][1] == 'JKQ' or li[j][1] == 'JX' or li[j][1] == 'JC' or li[j][1] == 'VCP+EF' or li[j][1] == 'VCP' or li[j][1] == 'EF' or li[j][0] == ',' or li[j][0] == '.':
                        temp_str = li[j][0]
                        li.insert(ix+k, (temp_str, 'AAA'))
                        k = k + 1

            for i in range(0, len(res1)):
                j = res1[i]
                while j < res2[i] + 1:
                    if li[j][1] == 'JKS' or li[j][1] == 'JKC' or li[j][1] == 'JKG' or li[j][1] == 'JKO' or li[j][1] == 'JKB' or li[j][1] == 'JKV' or li[j][1] == 'JKQ' or li[j][1] == 'JX' or li[j][1] == 'JC' or li[j][1] == 'VCP+EF' or li[j][1] == 'VCP' or li[j][1] == 'EF' or li[j][0] == ',' or li[j][0] == '.':
                        del li[j]
                        res1 = list(
                            filter(lambda x: li[x][0] == '[', range(len(li))))
                        res2 = list(
                            filter(lambda x: li[x][0] == ']', range(len(li))))
                        j = res1[i]
                    else:
                        j = j + 1

            str4 = ''
            for i in range(0, len(li)):
                str4 = str4 + li[i][0]

            ix = list(filter(lambda x: str3[x] == ' ', range(len(str3))))

            str4_list = list(str4)

            for i in ix:
                str4_list.insert(i, ' ')

            final_str = ''
            for i in range(0, len(str4_list)):
                final_str = final_str + str4_list[i]

            f.write("{}\n".format(final_str))

            sql = f'UPDATE SENTENCE SET Sresult = "{final_str}" WHERE Uid = "{userid}" AND Snumber = {Wnumber}'
            curs.execute(sql)
            conn.commit()

            Wspos_list = list()
            Wepos_list = list()
            for i in range(len(final_str)):
                if final_str[i] == '[':
                    Wspos_list.append(i - (len(Wspos_list) * 7))
                elif final_str[i] == ':':
                    Wepos_list.append(i - (len(Wepos_list) * 7) - 1)

            tag_pos = 0
            for Wform, Wtag in zip(words, preds):
                if Wtag == 'O':
                    sql = f'INSERT INTO WORD VALUES("{userid}", {Wnumber}, {Wid}, NULL, NULL, "{Wform}", "O")'
                    curs.execute(sql)
                else:
                    sql = f'INSERT INTO WORD VALUES("{userid}", {Wnumber}, {Wid}, {Wspos_list[tag_pos]}, {Wepos_list[tag_pos]}, "{Wform}", "{Wtag}")'
                    tag_pos += 1
                    curs.execute(sql)
                Wid += 1
                conn.commit()

    logger.info("Prediction Done!")


if __name__ == "__main__":
    init_logger()

    parser = argparse.ArgumentParser()

    input = config['path']['input']
    output = config['path']['output']
    model = config['path']['model_path']

    parser.add_argument("--input_file", default=input,
                        type=str, help="Input file for prediction")
    parser.add_argument("--output_file", default=output,
                        type=str, help="Output file for prediction")
    parser.add_argument("--output_dir", default=model,
                        type=str, help="Path to save, load model")
    parser.add_argument("--batch_size", default=32, type=int,
                        help="Batch size for prediction")
    parser.add_argument("--no_cuda", action="store_true",
                        help="Avoid using CUDA when available")
    parser.add_argument("userid", type=str)

    pred_config = parser.parse_args()
    userid = pred_config.userid

    if(userid == ''):
        userid = 'visitor'
    else: userid = pred_config.userid

    predict(pred_config)