import React, {useState, useCallback, useEffect, useMemo} from 'react';
import styled from 'styled-components';
import axios from 'axios';
import moment from 'moment';
import {useHistory} from 'react-router-dom';

import CommonLayout from 'components/Layout/CommonLayout';
import StickyBox from 'components/Parts/StickyBox';

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const Manage = () => {

    const history = useHistory();

    const [report, setReport] = useState([]);
    const [origin, setOrign] = useState([]);
    const [modify, setModify] = useState([]);
    const [clickedList, setClickedList] = useState([]);

    // const originData = useMemo(() => {
    //     return origin.filter(o => report.find(r => r.Uid === o.Uid && r.Snumber === o.Snumber)) //.sort((a,b) => moment(b.Rdate).unix() - moment(a.Rdate).unix());
    // },[report, origin]);

    // const modifyData = useMemo(() => {
    //     return modify.filter(m => report.find(r => r.Uid === m.Uid && r.Snumber === m.Snumber)) //.sort((a,b) => moment(b.Rdate).unix() - moment(a.Rdate).unix());
    // },[report, modify]);

    const getReportState = useCallback((sentence) => {

        const rowOne = origin.find(r =>  r.Uid === sentence.Uid && r.Snumber === sentence.Snumber);

        switch(rowOne.Rstate) { // 수정 완료인데 익스텐션 되거나 수정 요청이어야하는데 수정 완료 되어있거나 상태 개판임
            case 1 : 
                return '수정 거부';
            case 2 : 
                return '수정 완료';
            default: 
                return '수정 요청';
        };
    },[origin]);

    useEffect(() => {

        axios.get(`${SERVER_URL}/report`).then((res) => {
            setReport(res.data);
        });

    },[report]);

    useEffect(() => {
        axios.get(`${SERVER_URL}/origin`).then((res) => {
            setOrign(res.data);
        });

       axios.get(`${SERVER_URL}/modify`).then((res) => {
            setModify(res.data);
        }); 
   },[getReportState]);

    useEffect(() => {
        const arr = new Array(origin.length).fill(false);
        setClickedList([...arr]);
    },[]);

    const handleExtension = useCallback((i,flag) => {
        setClickedList((state) => {
            const arr = [...state];
            arr[i] = !flag;
            return [...arr];
        });
    },[]);

    const handleConfirm = useCallback((sentence) => {
        const result = report.find(x => x.Uid === sentence.Uid && x.Snumber === sentence.Snumber);
        const params = {};
        params.Uid = sentence.Uid;
        params.Snumber = sentence.Snumber;
        params.Wid = result.Wid;

        axios.post(`${SERVER_URL}/manage/confirm`, {params}).then((res) => {
            console.log(res);
        });

    },[report]);

    const handleReject = useCallback((sentence) => {
        const params = {};
        params.Snumber = sentence.Snumber;
        params.Uid = sentence.Uid;
        axios.post(`${SERVER_URL}/manage/reject`, {params}).then((res) => {
            console.log(res);
        });
    },[report]);

    return (
        <CommonLayout>
            <Wrapper>
                <Container>
                    <Title>수정 요청 목록</Title>
                    <Table>
                        <div className="column">
                            <span>번호</span>
                            <span>문장</span>
                            <span>ID</span>
                            <span>상태</span>
                        </div>
                        {origin.map((x,i) => {
                            return <div key={i} className="rows">
                                <span>{i+1}</span>
                                <span onClick={() => handleExtension(i,clickedList[i])}>
                                    <div>{x.sentence}</div>
                                    <div className="modify">{"↳" + modify.find((_,j)=> i === j)?.sentence}</div>
                                </span>
                                <span>{x.Uid}</span>
                                <span>
                                    <Button disabled state={getReportState(x)}>{getReportState(x)}</Button>
                                </span>
                                {
                                    origin.find(row => row.Uid === x.Uid && row.Snumber === x.Snumber && row.Rstate === 0) && clickedList[i] && <ExBtnWrapper>
                                        <button onClick={() => handleConfirm(x)}>수락</button>
                                        <button onClick={() => handleReject(x)}>거부</button>
                                    </ExBtnWrapper>
                                }
                            </div>;
                        }).reverse()}
                    </Table>
                </Container>
            </Wrapper>
        </CommonLayout>
    );
};

export default Manage;

const ExBtnWrapper = styled.div`
    display: flex;
    justify-content: center;
    > button:nth-child(1) {
        background-color: #2CBA9C;
        margin-right: 10px;
    }

    > button:nth-child(2) {
        background-color: #FD79A9;
    }

    > button {
        border: none;
        border: 1px solid black;
        font-size: 16px;
        margin-top: 10px;
        padding: 3px 10px;
    }
`;

const Button = styled.button`

    ${p => p.state === '수정 요청' && `
        background-color: lightgray;
        color: black;
    `};

    ${p => p.state === '수정 거부' && `
        background-color: red;
        color: white;
    `};

    ${p => p.state === '수정 완료' && `
        background-color: #005c3e;
        color: white;
    `};

    border: none;
    border: 1px solid black;
    width: 65px;
`;

const Table = styled.div`
    > div {
        padding: 5px 0;
        line-height: 2;
        border-bottom: 1px solid gray;
        cursor: pointer;
        :hover {
            background-color: lightgray;
        }
    }
    .column > span {
        font-size: 16px;
        font-weight: bold;

        &:nth-child(2) {
        text-align: center;
        }

        &:nth-child(3) {
            text-align: center;
        }

        &:nth-child(4) {
            padding-left: 15px;
        }
    }

    .rows > span:not(:nth-child(2)) {
        position: relative;
        top: -11px;
    }

    .modify {
        padding-left:5px;
    }

    > div > span {
        display: inline-block;
    }

    >div > span:nth-child(1) {
        text-align: center;
        width: 5%;
    }

    >div > span:nth-child(2) {
        width: 65%;
    }

    >div > span:nth-child(3) {
        text-align: center;
        width: 23%;
    }

    >div > span:nth-child(4) >button {
        outline: none;
    }
    width: 100%;
    height: 100%;
    overflow: auto;
`;

const Wrapper = styled.div`
    display: flex;
    width: 90%;
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
