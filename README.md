# Viva Pro.
광운대학교 제 5회 산학연계 SW프로젝트(2020-2021) - 한화시스템

# 전체 시스템 구조도
![system](https://user-images.githubusercontent.com/56755768/121120955-a0c76a00-c859-11eb-978e-9aaf8b3d4f55.png)

# 모듈 설명

-------------------------------------

### NER SERVICE MODULE

+ 웹 페이지 형태의 서비스
+ 사용자가 웹페이지에 개체명 인식을 원하는 문장을 입력
+ 웹에서 결과가 시각화

---------------------------------------

### TRAINING MODULE

+ KoELECTRA가 CORPUS를 학습

----------------------------------------

### S.N.P MODULE

NER PREDICTION MODULE
+ SPELL CHECK MODULE에서 전처리가 완료된 입력 파일과 학습을 마친 TRAINING MODULE을 호출하여 예측 및 추론

SPELL CHECK MODULE
+ 맞춤법과 띄어쓰기가 올바르게 표기되어 입력 파일로 준비

POSTPOSITION SEPERATION MODULE
+ 개체명에 부착된 조사를 분리

-------------------------------------------

# Requirements

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


# Usage
-------------------------------------

### Program Build Manual

① !pip install transformers <br>
→ transformers 라이브러리를 설치합니다.

② from transformers import ElectraModel, ElectraTokenizer <br>
→ transformers 라이브러리의 ElectraModel과 ElectraTokenizer를 추가합니다.

③ model = ElectraModel.from_pretrained("monologg/koelectra-base-v3-discriminator") <br>
→ 저희팀은 KoELECTRA의 Base 모델과 Small 모델 중 Base 모델을 사용하였습니다. 또한, v1, v2, v3 중 v3를 사용하였습니다.

④ tokenizer = ElectraTokenizer.from_pretrained("monologg/koelectra-base-v3-discriminator")

⑤ !pip install attrdict <br>
→ attrdict를 설치합니다.

⑥ !pip install seqeval <br>
→ seqeval을 설치합니다.

⑦ run_ner.py 파일과 koelectra-base-v3.json 파일을 이용해서 코드를 실행합니다. <br>

-------------------------------------------------------------------------
### Config

#### config.js
```javascript
module.exports = {
	mysql: {
		host: "",       // localhost or IP Address
		user: "",       // mysql user
		password: "",   // mysql user's password
		database: ""    // mysql database name
	},
	secretInfo: {
		key: "",        // for login SECRET KEY
	},
	papago: {         // for translation, papago API
		clientId: "",
		clientSecret: ""
	}
};
```

#### config.json
```json
{
	"mysql": {
		"host" : "localhost or IP Address",
		"user" : "mysql user",
		"password" : "mysql user's password",
		"database" : "mysql user's password"
	},

	"path": {
		"input" : "Users/ABC/Downloads/Project/Input or home/ABC/Project/Input",
		"output" : "Output path",
		"model_path" : "Model path"
	}	
}
```
---------------------------------------------------------------------------------------
### node.js

#### Install npm packages
```bash
$ npm install
$ npm install packages_name
```

#### Run Local Server
```bash
$ nodemon server.js
$ node server.js
```

#### Python Module Interworking, Papago translation
```bash
$ npm run python
```

#### Run client
```bash
$ npm run start
```
--------------------------------------------------------------

# 팀원 소개

### 👑이원재(willy99624) [github](https://github.com/willy99624)

- 학번
  - 2018202059
- 역할
  - 모델 실행
  - 서비스 전처리(맞춤법 검사)
  - 서비스 후처리(조사 분리)

<br/>

### 🥇조우진(to82350) [github](https://github.com/to82350)

- 학번
  - 2015722057
- 역할
  - 모델 예측
  - 개체명 시각화
  - 웹 레이아웃 및 CSS
  - DB 연동

<br/>

### ✡️송현우(Songhyunwoo666) [github](https://github.com/Songhyunwoo666)

- 학번
  - 2016802026
- 역할
  - 문서 작업
  - PPT 제작
  - 최종 발표

<br/>

### 💻신규표(Gyupyo) [github](https://github.com/Gyupyo)

- 학번
  - 2018202058
- 역할
  - 웹 크롤링
  - 학습 말뭉치 전처리
  - DB 설계

<br/>

### 💡손승현(sonshn) [github](https://github.com/sonshn)

- 학번
  - 2018202064
- 역할
  - 말뭉치 수집
  - 모델 선정
  - CSS

<br/>

---------------------------------------------------------------------

# 시연 영상

[![example_video](https://img.youtu.be/yfYveP8C2bE/default)](https://youtu.be/yfYveP8C2bE)
