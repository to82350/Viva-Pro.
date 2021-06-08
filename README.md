# Viva Pro.
광운대학교 제 5회 산학연계 SW프로젝트(2020-2021) - 한화시스템

# 전체 시스템 구조도
![system](https://user-images.githubusercontent.com/56755768/121120955-a0c76a00-c859-11eb-978e-9aaf8b3d4f55.png)

## Dependencies

- python==3.7.6
- transformers==4.3.2
- tqdm==4.47.0
- torch==1.7.1
- tokenizers==0.10.1
- tensorflow==1.14.0
- six==1.14.0
- seqeval==1.2.2
- sentencepiece==0.1.95
- PyMySQL==1.0.2
- py-hanspell==1.1
- numpy==1.18.1
- mecab-python==0.996-ko-0.9.2
- mecab-python3==1.0.3
- konlpy==0.5.2
- attrdict==2.0.1

```bash
$ pip3 install -r requirements.txt
$ pip install -r requirements.txt
```

# 모듈 설명

-------------------------------------

### NER SERVICE MODULE

+ 웹 페이지 형태의 서비스
+ 사용자가 웹페이지에 개체명 인식을 원하는 문장을 입력
+ 웹에서 결과가 시각화

---------------------------------------

### TRAINING MODULE

+ KoLECTRA가 CORPUS를 학습

----------------------------------------

### S.N.P MODULE

NER PREDICTION MODULE
+ SPELL CHECK MODULE에서 전처리가 완료된 입력 파일과 학습을 마친 TRAINING MODULE을 호출하여 예측 및 추론

SPELL CHECK MODULE
+ 맞춤법과 띄어쓰기가 올바르게 표기되어 입력 파일로 준비

POSTPOSITION SEPERATION MODULE
+ 개체명에 부착된 조사를 분리

-------------------------------------------

