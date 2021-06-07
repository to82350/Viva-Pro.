import React, {useState, useCallback, useEffect, useMemo} from 'react';
import styled from 'styled-components';
import axios from 'axios';
import {useHistory} from 'react-router-dom';

import CommonLayout from 'components/Layout/CommonLayout';
import StickyBox from 'components/Parts/StickyBox';

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const Detail = () => {

    const history = useHistory();
    const [data, setData] = useState([]);
    const Snumber = useMemo(() => history.location.pathname.split('/')[2],[]);
    
    const handleChange = useCallback((target, value, currentId) => {
        console.log(value);
        setData((curState) => {
            const arr = [];
            curState.forEach(item => {
                if(item.Wid === currentId) {
                    const updateState = {
                        ...item,
                        [target]:value
                    };
                    arr.push(updateState);
                }else {
                    arr.push(item);
                }
            });
            return arr;
        });
    },[data]);


    const handleClick = useCallback((item) => {
        axios
         .post(`${SERVER_URL}/insert`,{params: {...item}})
         .then(res => console.log(res));
    },[]);

    const handleConfirm = useCallback(() => {
        history.push('/board');
    },[]);

    useEffect(() => {
        const id = history.location.pathname.split('/')[2];
        const Uid = sessionStorage.getItem('Uid') || '';
        axios.get(`${SERVER_URL}/detailList?id=${id}&Uid=${Uid}`).then(res => {
            // console.log(res.data);
            setData(res.data);
        });
    },[]);

    return (
        <CommonLayout>
            <Wrapper>
                <Container>
                    <Title>오류 REPORT</Title>
                    <Table>
                        <div>
                            <span>단어</span>
                            <span>개체명 태그</span>
                            <span>태그 시작 위치</span>
                            <span>태그 마지막 위치</span>
                        </div>
                        {data.map((item, idx, arr) => {
                            return (<div key={idx}>
                                <input value={item.Wform}></input>
                                <input onChange={(e) => handleChange('Wtag',e.target.value, item.Wid)} value={item.Wtag}></input>
                                <input onChange={(e) => handleChange('Wspos',e.target.value, item.Wid)} value={item.Wspos}></input>
                                <input onChange={(e) => handleChange('Wepos',e.target.value, item.Wid)} value={item.Wepos}></input>
                                <button onClick={() => handleClick(item)}>수정</button>
                            </div>);
                        })}
                    </Table>
                    <button onClick={handleConfirm}>확인</button>
                </Container>
            </Wrapper>
        </CommonLayout>
    );
};

export default Detail;

const Table = styled.div`
    > div {
        margin-bottom: 10px;
        line-height: 2;
    }
    > div > span {
        display: inline-block;
        font-size: 18px;
        font-weight: bold;
    }

    >div > span:nth-child(1) {
        text-align: center;
        width: 155px;
    }

    >div > span:nth-child(2) {
        text-align: center;
        width: 145px;
    }

    >div > span:nth-child(3) {
        text-align: center;
        width: 160px;
    }
    >div > span:nth-child(4) {
        text-align: center;
        width: 160px;
    }

    >div > span:not(last-child) {
    }

    width: 100%;
    height: 100%;
    overflow: auto;
`;

const Wrapper = styled.div`
    display: flex;
    width: 800px;
    height: calc(100% - 70px);
    justify-content: center;
    margin-top: 3rem;
`;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 500px;
    padding: 20px;
    border-radius: 20px;
    background-color: #ffffff;
`;

const Title = styled.h1`
    margin: 0px 0px 40px 0px;
    font-size: 2.5rem;
    font-weight: 500;
    text-align: center;
`;

const DBResult = styled.div`
    border: 1px solid red;
`;

const SubTitle = styled.h4`
    padding-top: 1rem;
    margin: 0 auto;
    font-size: 1.25rem;
    font-weight: 300;
`;
