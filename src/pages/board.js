import React, {useState, useCallback, useEffect, useMemo} from 'react';
import styled from 'styled-components';
import axios from 'axios';
import moment from 'moment';
import {useHistory} from 'react-router-dom';

import CommonLayout from 'components/Layout/CommonLayout';
import StickyBox from 'components/Parts/StickyBox';

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const Board = ({...p}) => {

    const history = useHistory();

    const [data, setData] = useState([]);
    const [reportData, setReportData] = useState([]);

    const getReportState = useCallback((sentence) => {
        const myUid = sessionStorage.getItem('Uid') || 'visitor'
        // 아마 이 부분에 아이디랑 Snumber 같이 검사해서 그런듯, 비지터 로그인 하면 검토 중 잘 나옴

        const rowOne = reportData.find(row => row.Snumber === sentence.Snumber && row.Uid === myUid) || -1;
        switch(rowOne.Rstate) {
            case 0 : 
                return '검토 중'; // 로그인 없이 수정하고 나서 수정 전 버튼이 검토 중으로 변하질 않음, 디비 내에서는 아이디 없어도 비지터로 잘 들어감.
            case 1 : 
                return '수정 거부';
            case 2 : 
                return '수정 완료';
            
            default: return '수정 전';
        };
    },[reportData]);

    useEffect(() => {
        const Uid = sessionStorage.getItem('Uid') || '';

        axios.get(`${SERVER_URL}/history?Uid=${Uid}`).then(res => {
            // console.log(p.user);
            setData(res.data);   
        });

        axios.get(`${SERVER_URL}/report`).then(res => {
            setReportData(res.data);
        });
    },[]);

    const handleOpenDetail = useCallback((id) => {

        const myUid = sessionStorage.getItem('Uid') || ''
        // '수정 전'이 아니면 클릭 안됌.
        // if(reportData.findIndex(row => row.Snumber === id && row.Uid === myUid) !== -1) return;
        if(getReportState({Snumber: id}) !== '수정 전') return;
        history.push(`detail/${id}`);

    },[reportData]);

    return (
        <CommonLayout>
            <Wrapper>
                <Container>
                    <Title>개체명 인식 History</Title>
                    <Table>
                        <div className="column">
                            <span>번호</span>
                            <span>문장</span>
                            <span>시간</span>
                            <span>상태</span>
                        </div>
                        {data.map((item, idx, arr) => {
                            return (<div key={idx}>
                                <span>{item.Snumber + 1}</span>
                                <span onClick={() => handleOpenDetail(item.Snumber)}>{item.sentence}</span>
                                <span>{moment(item.Sdate).format('YY-MM-DD HH:mm:ss')}</span>
                                <span>
                                    <Button state={getReportState(item)}>
                                        {getReportState(item)}
                                    </Button>
                                </span>
                            </div>);
                        }).reverse()}
                    </Table>
                </Container>
            </Wrapper>
        </CommonLayout>
    );
};

export default Board;

const Button = styled.button`

    background-color: lightgray;

    ${p => p.state === '검토 중' && `
        background-color: #F7CACA;
    `};

    ${p => p.state === '수정 거부' && `
        background-color: red;
        color: white;
    `};

    ${p => p.state === '수정 완료' && `
        background-color: #005c3e;
        color: white;
    `};

    text-align: center;
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
            padding-left: 40px;
        }

        &:nth-child(4) {
            padding-left: 15px;
        }
    }

    > div > span {
        display: inline-block;
    }

    >div > span:nth-child(1) {
        text-align: center;
        width: 5%;
    }

    >div > span:nth-child(2) {
        width: 76%;
    }

    >div > span:nth-child(3) {
        width: 12%;
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
    height: 650px;
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
