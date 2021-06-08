# Viva Pro.
광운대학교 제 5회 산학연계 SW프로젝트(2020-2021) - 한화시스템

# 전체 시스템 구조도
![system](https://user-images.githubusercontent.com/56755768/121120955-a0c76a00-c859-11eb-978e-9aaf8b3d4f55.png)

# 모듈 설명

```python
from transformers import ElectraModel, ElectraTokenizer

model = ElectraModel.from_pretrained("monologg/koelectra-base-v3-discriminator")
tokenizer = ElectraTokenizer.from_pretrained("monologg/koelectra-base-v3-discriminator")
```
