import React from 'react';
import styled from 'styled-components';

import CommonModal from './CommonModal';

const PofolModal = ({...p}) => {
    return (
        <CommonModal
            {...p}
            size={'800px'}
            btnText={'Close'}
            titleAlign={'left'}
            hBgColor={'#ffffff'}
            fBgColor={'#ffffff'}
            btnAlign={'right'}
        >
            <Content>
                <Img src="https://media.vlpt.us/images/hyundong_kk/post/d44d940d-344b-4bcf-8980-52b66265add2/Ekran-Resmi-2019-11-18-18.08.13.png" />
                <Desc>{`React는 사용자 인터페이스를 구축하기 위한 선언적이고 효율적이며 유연한 JavaScript 라이브러리입니다. “컴포넌트”라고 불리는 작고 고립된 코드의 파편을 이용하여 복잡한 UI를 구성하도록 돕습니다.`}</Desc>
            </Content>
        </CommonModal>
    );
};

export default PofolModal;

const Content = styled.div`
    display: flex;
    border-top: 1px solid #efefef;
    border-bottom: 1px solid #efefef;
    > * {
        padding: 16px;
    }
`;

const Img = styled.img.attrs(() => ({
    alt: 'image',
}))`
    width: 434px;
    height: 234px;
`;

const Desc = styled.div`
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
`;
