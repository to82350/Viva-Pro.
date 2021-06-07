import React, {useState, useCallback, useMemo, useEffect} from 'react';
import {useHistory, useLocation} from 'react-router-dom';
import styled, {keyframes} from 'styled-components';

import LoginModal from 'components/Modal/LoginModal';
import SignupModal from 'components/Modal/SignupModal';

import useVisible from 'hooks/useVisible';

const NavBar = ({...p}) => {
    const [currentTab, setCurrentTab] = useState(0);
    const [openLogin, setOpenLogin] = useState(false);
    const [openSignup, setOpenSignup] = useState(false);
    const [authenticated, setAuthenticated] = useState(false);
    const [accessToken, setAccessToken] = useState('');
    const {ref: dropdownRef, isVisible, setIsVisible} = useVisible(false);
    const history = useHistory();

    const manager = sessionStorage.getItem('Uid') === 'vivapro';

    const tabs = useMemo(
        () => [
            {id: 0, label: 'Home', path: '/'},
            {id: 1, label: 'Service', path: '/service'},
            {id: 2, label: manager ? 'manage' : 'History', path: manager ? '/manage' : '/board'},
            {id: 3, label: 'About', path: '/about'},
            
        ],
        []
    );

    const moveToClickedPage = useCallback(
        tab => {
            if (tab === 'logo') history.push('/');

            setCurrentTab(tab.id);

            if (tab.dropdownList) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }

            history.push(tab.path);
        },
        [history, setIsVisible]
    );

    const openLoginModal = () => {
        if (authenticated) {
            if (window.confirm('로그아웃 하시겠습니까?')) {
                sessionStorage.removeItem('access_token');
                sessionStorage.removeItem('Uid');
                history.replace('/');
                window.location.reload();
                setOpenLogin(false);
            }
            return;
        }
        setOpenLogin(true);
    };

    const openSignupModal = () => {
        setOpenSignup(true);
    };

    // sessionStorage
    useEffect(() => {
        if(accessToken) {
            sessionStorage.setItem('access_token', accessToken);
        }

        if(sessionStorage.getItem('access_token')){
            setAuthenticated(true);
        }

    },[accessToken]);

    return (
        <Tabs {...p}>
            <LeftBox>
                <Typography onClick={() => moveToClickedPage('logo')}>
                    SY
                    <span className="text-color-n">N</span>
                    <span className="text-color-e">E</span>
                    <span className="text-color-r">R</span>
                    GY
                </Typography>
                {tabs.map(tab => (
                    <Tab
                        key={tab.id}
                        clicked={currentTab === tab.id}
                        children={
                            tab.dropdownList ? (
                                <>
                                    {tab.label}
                                    {isVisible && (
                                        <Dropdown ref={dropdownRef}>
                                            {tab.dropdownList.map(x => (
                                                <div
                                                    key={x.id}
                                                    onClick={() => moveToClickedPage(x)}
                                                >
                                                    {x.label}
                                                </div>
                                            ))}
                                        </Dropdown>
                                    )}
                                </>
                            ) : (
                                tab.label
                            )
                        }
                        dropdown={tab.dropdownList}
                        onClick={() => moveToClickedPage(tab)}
                    />
                ))}
            </LeftBox>
            <RightBox>
                <LoginTab onClick={openLoginModal}>{authenticated ? 'Log out' : 'Log in'}</LoginTab>
                <LoginModal
                    open={openLogin}
                    setOpen={setOpenLogin}
                    setAuthenticated={setAuthenticated}
                    accessToken={accessToken}
                    setAccessToken={setAccessToken}
                />
                {!authenticated && <SignupTab onClick={openSignupModal}>Sign Up</SignupTab>}
                <SignupModal
                    open={openSignup}
                    setOpen={setOpenSignup}
                    setAuthenticated={setAuthenticated}
                />
            </RightBox>
        </Tabs>
    );
};

export default NavBar;

const Tabs = styled.div`
    display: flex;
    justify-content: space-between;
    position: sticky;
    min-width: 640px;
`;

const LeftBox = styled.div`
    display: flex;
`;
const RightBox = styled(LeftBox)``;

const Tab = styled.div`
    cursor: pointer;
    position: relative;
    padding: 10px 30px;
    font-weight: 500;
    ${p =>
        !p.dropdown &&
        `
        :hover {
            color: #b5b5b5;
            transition: transform 180ms;
    }`}
    ${p =>
        p.dropdown &&
        `
        display: flex;
        ::after {
            display: inline-block;
            position: relative;
            top: 6px;
            left: 6px;
            content: "";
            border-top: .3em solid;
            border-right: .3em solid transparent;
            border-bottom: 0;
            border-left: .3em solid transparent;
        }
    }
    `}
    ${p =>
        p.clicked &&
        `
        background-color: #EFEFEF;
        
    `};
`;

const LoginTab = styled(Tab)``;
const SignupTab = styled(LoginTab)``;

const flutter = keyframes`
    0% {
        transform: rotate(0deg);
    }
    35% {
        transform: rotate(0deg);
    }
    40% {
        transform: rotate(-5deg);
    }
    60% {
        transform: rotate(5deg);
    }
    65% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(0deg);
    }
`;

const Typography = styled.div`
    cursor: pointer;
    display: flex;
    align-items: center;
    font-size: 1.2rem;
    font-weight: bold;
    padding: 0 30px 0 0;
    transform-origin: center;
    /* animation: ${flutter} 2s linear infinite; */

    .text-color-n {
        font-size: 1.2rem;
        color: #ffb604;
    }

    .text-color-e {
        font-size: 1.2rem;
        color: #d03c8c;
    }

    .text-color-r {
        font-size: 1.2rem;
        color: #ee5839;
    }

`;

const Dropdown = styled.div`
    position: absolute;
    top: 2rem;
    left: 3rem;
    width: 180px;
    padding: 0.5rem 0;
    background-color: #ffffff;
    background-clip: padding-box;
    border: 1px solid rgba(0, 0, 0, 0.15);
    border-radius: 0.25rem;
    z-index: 10;

    > div {
        padding: 0.25rem 1.5rem;
        :hover {
            color: #b5b5b5;
        }
    }
`;
