import React, {useCallback, useState} from 'react';
import styled from 'styled-components';
import Slider from 'react-slick';

import PofolModal from 'components/Modal/PofolModal';
import CommonLayout from 'components/Layout/CommonLayout';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const settings = {
    accessibility: true,
    infinite: true,
    centerMode: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
};

const About = () => {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState('');
    const handleOpenModal = useCallback(text => {
        setOpen(true);
        setTitle(text);
    }, []);

    return (
        <>
            <CommonLayout>
                <Section>
                    <Box>
                        <Img1 src="./img/kw.png" /><br></br>
                        <Img2 src="./img/hanhwa.png" /><br></br><br></br>
                        <H1>광운대학교 산학연계 SW프로젝트<br></br><br></br>
                        VIVA PRO. 팀 소개
                        </H1>
                        <H2>프로젝트 주제 : 인공지능 자연어처리 기반 개체명 인식기 고도화 기술 개발</H2>
                        <H2>팀장 : 이원재<br></br>
                            팀원 : 조우진, 송현우, 신규표, 손승현<br></br><br></br>
                            지도교수 : 이혁준 교수님<br></br>
                            조교 : 이지훈 조교님<br></br></H2>
                        <Paragraph>
                            {`저희 팀은 2020년 7월부터 한화시스템과 같이 산학연계 프로젝트를 진행하고 있습니다.\n `
                            .split('\n')
                            .map((text, i) => (
                                <span key={i}>
                                    {text}
                                    <br />
                                </span>
                            ))}
                        </Paragraph>     
                    </Box> 
                </Section>
            </CommonLayout>
        </>
    );
};

export default About;

const Section = styled.section`
    display: flex;
    justify-content: space-between;

    max-width: 1180px;
    width: 100%;
    margin-top: 3rem;
    margin-bottom: 6.2rem;
`;

const Box = styled.div`
    display: flex;
    flex-direction: column;
    padding: 1.25rem;
    height: 100%;
    background-color: #ffffff;
    border-radius: 20px;
`;

const H1 = styled.h1`
    display: flex;
    font-size: 22px;
    font-weight: 700;
    line-height: 1.2;
    margin-bottom: 2rem;
    ${p =>
        p.spacing &&
        `
        letter-spacing: 2px;
    `};
`;

const H2 = styled.h1`
    display: flex;
    font-size: 18px;
    font-weight: 600;
    line-height: 1.2;
    padding: 20px 0 0 0;
    ${p =>
        p.spacing &&
        `
        letter-spacing: 2px;
    `};
`;

const H5 = styled.h5`
    font-size: 1.25rem;
    font-weight: 500;
    line-height: 1.2;

    margin-bottom: 0.75rem;
`;

const Paragraph = styled.p`
    font-size: 16px;
    font-weight: 500;
    line-height: 1.5;
    :before {
        display: block;
        font-size: 3.5rem;      
    }
`;

const Text = styled.span`
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
`;

const Img1 = styled.img.attrs(() => ({
    alt: 'image',
}))`
    margin-left: 20px;
    width: 200px;
    height: 70px;
`;

const Img2 = styled.img.attrs(() => ({
    alt: 'image',
}))`
    margin-left: 20px;
    width: 200px;
    height: 65px;
`;
