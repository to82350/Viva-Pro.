import React, {useState, useEffect, useCallback} from 'react';
import axios from 'axios';
import styled from 'styled-components';

import Mini from 'components/Blog/Mini';
import MainLayout from 'components/Layout/MainLayout';
import Button from 'components/Parts/Button';

const SERVER_URL = process.env.REACT_APP_SERVER_URL;
const PYTHON_TEST = process.env.REACT_APP_PYTHON;

const Service = () => {
    const [data, setData] = useState([]);
    const [strResult, setStrResult] = useState('');

    useEffect(() => {
        const getPosts = async () => {
            const response = await axios.get(`${SERVER_URL}/posts`);
            return response.data;
        };

        getPosts().then(res => {
            setData(res);
        });
    }, []);
    const handleClick = useCallback(() => {
        axios
            .post(`${PYTHON_TEST}/python`, {
                data: {
                    name: '승현',
                    message: '유레카',
                },
            })
            .then(res => {
                setStrResult(res.data);
            });
    }, []);

    return (
        <MainLayout>
            <Content>
                <Section>
                    <Box>
                        <Title>
                            개체명 인식(NER)이란
                        </Title>
                        <Text>
                            <Paragraph>
                                {`개체명 인식은 비정형 텍스트의 개체명(단어, 어구) 언급을 \n
                                인명 (PS, person), 기관 (OG, organization), 날짜 (DT, date), \n
                                학문 분야 (FD, field), 시간 (TI, time), 수량 (QT, quantity), \n
                                동물 (AM, animal), 이론 (TR, theory), 인공물 (AF, artifact), \n
                                용어 (TM, term), 문명 (CV, civilization), 물질 (MT, material), \n
                                지역 (LC, location), 이벤트 (EV, event), 식물 (PT, plant) \n
                                총 15가지 태그로 분류하여 위치시키는 정보 추출의 하위 태스크이다. \n\n\n
                                <개체명 인식 예시>`
                                
                                .split('\n')
                                .map((text,i)=>(
                                    <span key={i}>
                                        {text}
                                        <br />
                                    </span>
                                ))}
                            </Paragraph>
                            <Img1 src="./img/ner_ex2.png" /><br></br>
                            <Img2 src="./img/ner_ex1.png" />
                        </Text>                        
                    </Box>
                </Section>
                <Section>
                    <Top>
                        <Title>
                            BIO 태그
                        </Title>
                        <Text>
                            <Paragraph>
                                {
                                    `B – begin 개체명의 시작 \n 
                                    I – inside 개체명의 중간 또는 끝 \n
                                    O – outside 개체명을 포함하지 않음 \n
                                    여러 단어들이 하나의 개체명이 되는 경우를 처리하기 위해 사용한다.`
                                    .split('\n')
                                    .map((text,i)=>(
                                        <span key={i}>
                                            {text}
                                            <br />
                                        </span>
                                    ))}
                            </Paragraph>
                        </Text>
                    </Top>
                    <Bottom>
                        <Title>
                            개체명 인식의 기대효과
                        </Title>
                        <Text>
                            <Paragraph>
                                {`특정 태그가 포함된 개체명에 태그 유형별로 각기 다른 색깔을 이용해 시각화하여 \n
                                외국인이 한국어를 공부하거나, 한국어로 된 문서를 읽을 때 \n 
                                단어들이나 문장의 의미를 더 쉽게 이해시키는데 도움을 줌`
                                .split('\n')
                                .map((text,i)=>(
                                    <span key={i}>
                                        {text}
                                        <br />
                                    </span>
                                ))}
                            </Paragraph>
                        </Text>
                    </Bottom>
                </Section>
            </Content>
        </MainLayout>
    );
};

export default Service;

const Content = styled.main`
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: space-between;
`;

const Section = styled.section`
    display: flex;
    flex-direction: column; // row -> justify-content 가로 // align-items 세로
    justify-content: center;
    align-items: center;
    width: 100%;
    font-size: 1rem;
    line-height: 1.5;
    padding: 50px;
`;

const Box = styled.div`
    width: 100%;
    height: 100%;
    background-color: #ffffff;
    border-radius: 20px;
    color: black;
`;

const Top = styled(Box)`
    margin-bottom: 40px; // top bottom 간격
`;

const Bottom = styled(Box)`
`;

const Title = styled.div`
    padding: 15px 0 10px 20px; // top: 20px, right: 20px, bottom: 20px, left: 20px
    font-size: 22px;
    font-weight: bold;
`;

const Text = styled.div`
    padding: 20px;
    /* font-size: 16px; */ 
    /* font-weight: 500; */
`;

const Paragraph = styled.p`
    font-size: 15px;
    line-height: 1;
    :before {
        display: block;
        font-size: 15px;
    }
`;

const Img1 = styled.img.attrs(() => ({
    alt: 'image',
}))`
    width: 200px;
`;

const Img2 = styled.img.attrs(() => ({
    alt: 'image',
}))`
    width: 360px;
`;
