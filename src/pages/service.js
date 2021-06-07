import React, {useState, useCallback, useEffect, useLayoutEffect, useMemo, useRef} from 'react';
import {useHistory, useLocation} from 'react-router-dom';
import qs from 'querystring';
import axios from 'axios';
import styled from 'styled-components';

import {FaArrowAltCircleUp} from 'react-icons/fa';
import Post from 'components/Blog/Post';
import CommonLayout from 'components/Layout/CommonLayout';
import ButtonBase from 'components/Parts/Button';
import StickyBox from 'components/Parts/StickyBox';
import Popover from 'components/Parts/Popover';

// AF   #2F4F4F
// AM   #A0522D
// TR   #006400
// PS   #F7CACA
// DT   #FF0000
// PT   #00FF00
// EV   #00CED1
// LC   #FFA500
// TI   #FFFF00
// QT   #0000FF
// MT   #FF00FF
// OG   #6495ED
// CV   #FF1493
// FD   #98FB98
// TM   #4B0082

const colors = [
    {id: 'AF', color: '#2F4F4F', desc: '인공물', w: true},
    {id: 'AM', color: '#A0522D', desc: '동물',w: true},
    {id: 'TR', color: '#006400', desc: '이론',w: true},
    {id: 'PS', color: '#F7CACA', desc: '인물'},
    {id: 'DT', color: '#FF0000', desc: '날짜', w: true},
    {id: 'PT', color: '#00FF00', desc: '식물'},
    {id: 'EV', color: '#00CED1', desc: '이벤트'},
    {id: 'LC', color: '#FFA500', desc: '지역'},
    {id: 'TI', color: '#FFFF00', desc: '시간'},
    {id: 'QT', color: '#0000FF', desc: '수량', w: true},
    {id: 'MT', color: '#FF00FF', desc: '물질', w: true},
    {id: 'OG', color: '#6495ED', desc: '기관'},
    {id: 'CV', color: '#FF1493', desc: '문명'},
    {id: 'FD', color: '#98FB98', desc: '학문 분야'},
    {id: 'TM', color: '#4B0082', desc: '용어', w: true},
];

// const SERVER_URL = process.env.REACT_APP_SERVER_URL;
const PYTHON_TEST = process.env.REACT_APP_PYTHON;

const Blog = React.forwardRef((props, ref) => {

    const [text1, setText1] = useState('');
    const [result, setResult] = useState('');
    const [check, setCheck] = useState(false);
    const [tableArr, setTableArr] = useState([]);
    const [translatedText, setTranslatedText] = useState('');
    const el = useRef(null);

    const handleClickUp = useCallback(() => {
        if (ref && ref.current) {
            ref.current.scrollIntoView({
                behavior: 'smooth',
            });
        }
    }, [ref]);


    const handleChange = useCallback(e => {
        setText1(e.target.value);
    }, []);

    const handleClick = async () => {
        setResult('Loading ... ');

        const fetchWrite = await axios.post(`${PYTHON_TEST}/write`, {
            data: {
                text: text1,
                checked: check,
                Uid: sessionStorage.getItem('Uid') || ''
            },
        });

        const papagoResult = await axios.get(`${PYTHON_TEST}/translate`);
        setTranslatedText(papagoResult.data.message.result.translatedText);

        if (!fetchWrite.data.payload) return;

        //await axios.get(`${PYTHON_TEST}/post`);

        axios.get(`${PYTHON_TEST}/read`).then((res) => {
            // console.log(res);
            setResult(res.data);
        })
    };

    // console.log(translatedText);

    // el && el.current && console.log(el.current.querySelectorAll('div > span')[0].innerText.match(/^[가-힣]*/)[0]);
    // el && el.current && console.log(el.current.querySelectorAll('div > span')[1].innerText.match(/^[가-힣]*/)[0]);

    const handleWiki = useCallback(i => {
        const text = el.current.querySelectorAll('div > span')[i].innerText.match(/^[가-힣]*/)[0];
        window.open(`https://ko.wikipedia.org/wiki/${text}`, "Popup", "width=500,height=500, scrollbars=yes");
    },[tableArr]);

    useEffect(() => {
        tableArr[0]?.forEach((_,i) => {
            if(el.current.innerText === 'Loading ...') return;
            el.current
                .querySelectorAll('div > span')[i]
                .addEventListener('click',() => handleWiki(i));

        });
    },[tableArr, result, el, el.current]);

    useEffect(() => {
        setTableArr([...visualizedText(result)[1]]);
    },[result]);

    const visualizedText = str => {
        const regex = /\[(.*?)\]/gm;
        // let str = `직업에는 다양한 것들이 있는데[CEO,:CV-B][CTO,:AF-B] [메이크업:CV-B] [아티스트:DT-I] 등이 있다.`;
        let m;
        let arr = [];
        let tableArr = [];
        let temp = [];
        let desc: '';

        while ((m = regex.exec(str)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }

            // The result can be accessed through the `m`-variable.
            m.forEach((match, groupIndex) => {

                if (groupIndex === 0) {
                    colors.forEach(x => {
                        if (match.includes(x.id)) {
                            arr.push({
                                id: m.index,
                                origin: match,
                                html: `<span style="cursor:pointer; border: 3px solid ${x.color}; border-radius: 8px;margin: 0 5px; padding-left: 5px;">${match.slice(1,match.length-1).split(":")[0]}<span style="padding: 0 4px; margin-left: 4px; font-weight: bold; color: ${x.w ? '#ffffff' : ''}; background-color: ${x.color}; display: inline-block;">${x.id}</span></span>`,
                            });
                            desc = x.desc;
                        }
                    });
                }
                if (groupIndex === 1) {
                    temp.push({
                        text: match.split(':')[0], // 이 부분에 파파고 번역, 위키문서 연결 등 팝업창 가능?
                        tag: match.split(':')[1].slice(0, 2),
                        desc: desc
                    });
                    if (temp.length === 5) {
                        tableArr.push([...temp]);
                        temp = [];
                    }
                }
            });
        }

        tableArr.push([...temp]);
        arr.forEach(obj => {
            str = str.replace(obj.origin, obj.html);
        }, []);
        // console.log(arr);

        return [str, tableArr];
    };

    const handleCheck = useCallback(() => {
        setCheck(!check);
        // check && python 파일 실행
    }, [check]);

    return (
        <StyledLayout>
            <Wrapper>
                <Container>
                    <Label top="10" left="5">{translatedText ? <Popover text={translatedText}>입력</Popover> : '입력'}</Label>
                    <Div>
                        
                        <TextArea placeholder="문장을 입력하세요." type="text" onChange={handleChange} value={text1} />
                    </Div>
                    <CheckBox>
                        <input
                            type="checkbox"
                            id="check"
                            name="check"
                            checked={check}
                            onChange={handleCheck}
                        />
                        <label>맞춤법 검사</label>
                    </CheckBox>
                    <InputBox>
                        <Button onClick={handleClick}>저장</Button>
                    </InputBox>
                    <LabelWrapper>
                        <Label top="-10" left="5">결과</Label>
                        <ResultBox ref={el} dangerouslySetInnerHTML={{__html: visualizedText(result)[0]}} />
                    </LabelWrapper>
                </Container>
                <Container><H1>개체명 태그 설명</H1><br></br><Img1 src="./img/explain.jpeg" />
                <Table>
                    {tableArr.map((pair, i1) => {
                        return (
                            <OuterDiv key={i1}>
                                <Pair>
                                    {pair.map((item, i2) => {
                                        return (
                                            <PairBox key={i2}>
                                                <div>{item.text}</div>
                                                <div>{item.tag}</div>
                                                <div>{item.desc}</div>
                                            </PairBox>
                                        );
                                    })}
                                </Pair>
                                <Divider />
                            </OuterDiv>
                        );
                    })}
                </Table>
                </Container>
            </Wrapper>
            <ArrowUp onClick={handleClickUp} />
        </StyledLayout>
    );
});

export default Blog;

const HighLightingText = styled.span``;

const Table = styled.div`
    display: flex;
`;

const OuterDiv = styled.div`
    display: flex;
`;

const Pair = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    line-height: 1.5;
    font-weight: bold;
`;

const Divider = styled.div`
    margin: 0 20px;
    border-left: 2px solid black;
`;

const PairBox = styled.div`
    display: flex;
    justify-content: space-between;
    > div {
        width: 50px;
    }
`;

const StyledLayout = styled(CommonLayout)`
    height: calc(100% - 63px);
`;

const InputBox = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 20px 0;
`;

const LabelWrapper = styled.div`
    height: 100%;
    position: relative;
    border: 2px solid #A04FFF;
    border-radius: 15px;
`;

const Label = styled.div`
    width: 40px;
    margin-left: 8px;
    text-align: center;
    position: relative;
    top: ${p => p.top + 'px'};
    left: ${p => p.left + 'px'};
    background-color: #ffffff;
    padding: 0 3px;
    font-size: 14px;
    font-weight: bold;
    color: #A04FFF;
    z-index: 10;
`;

const Div = styled.div`
    position: relative;
    display: flex;
    align-items: center;
`;

const TextArea = styled.textarea.attrs(() => ({
    type: 'text',
}))`
    padding: 15px;
    width: 100%;
    height: 100px;
    resize: none;
    outline: none;
    border: 2px solid #A04FFF;
    border-radius: 15px;
    box-shadow: 3px 3px 4px #b5b5b5 inset;
`;

const CheckBox = styled.div`
    margin-top: 15px; 
`;

const Button = styled(ButtonBase)`
    margin-left: 20px;
    font-size: 1rem;
    padding: 8px 1.2rem;
    font-weight: 700;
    line-height: 1;
    color: #ffffff;
    background-color: #A04FFF;
`;

const ResultBox = styled.div`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    padding: 10px;
    max-width: 1180px;
    letter-spacing: 1.1;
    line-height: 1.5;
`;

const Wrapper = styled.div`
    display: flex;
    width: 100%;
    height: 100%;
    padding: 3rem;
`;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    background-color: #ffffff;
    padding: 35px;
    &:first-child {
        margin-right: 50px;
    }
    border-radius: 20px;
`;

const Title = styled.h1`
    text-align: left;
    font-size: 2.5rem;
    font-weight: 500;
    margin-bottom: 0.5rem;
`;

const SubTitle = styled.h3`
    text-align: left;
    font-size: 1.5rem;
    font-weight: 500;
    margin-bottom: 0.5rem;
`;

const Posts = styled.div`
    display: flex;
    flex-direction: column;
`;

const StyledPost = styled(Post)`
    margin-bottom: 1.5rem;
`;

const Tag = styled(ButtonBase)`
    font-size: 75%;
    font-weight: 700;
    line-height: 1;
    background-color: gray;
    color: #ffffff;
`;

const ArrowUp = styled(FaArrowAltCircleUp).attrs(() => ({
    fill: 'gray',
    stroke: 'gray',
    strokeWidth: 20,
}))`
    position: fixed;
    font-size: 3rem;
    right: 80px;
    bottom: 36px;
    z-index: 100;
    background-color: #ffffff;
    border-radius: 50%;
    :hover {
        transform: scale(1.07);
        transition: transform 200ms;
        cursor: pointer;
        opacity: 0.8;
    }
`;

const Img1 = styled.img.attrs(() => ({
    alt: 'image',
}))`
    width: 100%;
    margin-bottom: 30px;
`;

const H1 = styled.h1`
    display: flex;
    font-size: 20px;
    font-weight: 600;
    line-height: 1.2;
    ${p =>
        p.spacing &&
        `
        letter-spacing: 2px;
    `};
`;