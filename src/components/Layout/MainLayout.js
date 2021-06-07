import React from 'react';
import styled from 'styled-components';

import Footer from 'components/Parts/Footer';

const MainLayout = ({children, ...p}) => {
    return (
        <Wrapper {...p}>
            {children}
            <Footer>Copyright © Viva Pro. 2020 - 2021</Footer>
        </Wrapper>
    );
};

export default MainLayout;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    position: absolute;
    z-index: -1;
    width: 100%;
    height: calc(100% - 63px);
    color: #ffffff;
    background-image: url('/img/main page.jpeg');
    background-repeat: no-repeat;
    background-size: cover;
`;
