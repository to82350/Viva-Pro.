import React, {useState, useRef, useEffect, useContext} from 'react';
import styled from 'styled-components';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import HideContext from 'Context/hide/HideContext';

import Main from 'pages/main';
import About from 'pages/about';
import Service from 'pages/service';
import Detail from 'pages/detail';
import Manage from 'pages/manage';
import Board from 'pages/board';

import NavBar from 'components/NavBar';

const Routes = () => {
    const topRef = useRef(null);

    const {isHide} = useContext(HideContext);

    return (
        <Router>
            <NavbarWrapper ref={topRef}>{!isHide && <NavBar />}</NavbarWrapper>
            <Switch>
                <Route exact path="/" children={<Main />} />
                <Route path="/service" children={<Service ref={topRef} />} />
                <Route path="/about" children={<About />} />
                <Route path="/board" children={<Board />} />
                <Route path="/detail/:id" children={<Detail />} />
                <Route path="/manage" children={<Manage />} />
            </Switch>
        </Router>
    );
};
export default Routes;

const NavbarWrapper = styled.div`
    width: 100%;
    padding: 12px 0;
    color: gray;
    > div {
        margin: 0 40px;
    }
`;
