const express = require('express');
var cors = require('cors');
const {spawn} = require('child_process');
const fs = require('fs');
const {papago} = require('./config');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

let query = "번역할 문장을 입력하세요.";

app.post('/write', async (req, res) => {
    const data = req.body.data;
    // console.log(data.Uid);
    await fs.writeFile('Input/input.txt', data.text, err => {
        if (err) {
            console.log(err);
            res.status(500).send('Internal Server error!!!');
        }
    });

    if (data.checked) {
        // await 전처리 실행
        await spawn('python', ['preprocess.py']);
        await console.log('전처리 실행');
    }
  
    const result = await spawn('python', ['predict.py', data.Uid]);
    await fs.readFile('Input/input.txt', 'utf-8', (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send('Internal Server error!!!');
        }
        query = data;
    });

    result.stdout.on('data', data => {
        console.log('응 성공');
    });

    result.stderr.on('data', function(data) {
        console.log('456', data.toString());
    });

    result.on('close', code => {
        res.send({payload: true});
    });
});

app.get('/read', async (req, res) => {
    // output example
    fs.readFile('Output/output.txt', 'utf-8', (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send('Internal Server error!!!');
        }
        res.send(data);
    });
});

const client_id = papago.clientId;
const client_secret = papago.clientSecret;


app.get('/translate', function (req, res) {

   const api_url = 'https://openapi.naver.com/v1/papago/n2mt';
   const request = require('request');
   const options = {
       url: api_url,
       form: {'source':'ko', 'target':'en', 'text':query},
       headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret}
    };
   request.post(options, function (error, response, body) {
     if (!error && response.statusCode == 200) {
       res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});
       res.end(body);
     } else {
       res.status(response.statusCode).end();
       console.log('error = ' + response.statusCode);
     }
   });
 });

app.listen(port, () => console.log(`Listening on ${port}`));
