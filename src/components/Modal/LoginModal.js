import React, {useState, useCallback, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import {TextField} from '@material-ui/core';

import CommonModal from './CommonModal';

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const LoginModal = ({...p}) => {

    const history = useHistory();

    const [error, setError] = useState(false);
    const [userList, setUserList] = useState([]);
    const [data, setData] = useState({
        email: '',
        password: '',
    });

    const handleChange = useCallback(
        (e, target) => {
            setData({
                ...data,
                [target]: e.target.value,
            });
        },
        [data]
    );

    useEffect(() => {
        setError(false);
    }, [p.open]);


    const searchForgotPW = useCallback(() => {}, []);

    const handleLogin = useCallback(() => {
        axios.post(`${SERVER_URL}/login`, {params: {
            Uid: data.email,
            Upassword: data.password
        }}).then(res => {
            console.log(res);
            if(res.data.message){
                setError(res.data.message);
                return;  
            };
            p.setAccessToken(res.data.access_token);
            sessionStorage.setItem('Uid',res.data.Uid);
            p.setOpen(false);
            p.setAuthenticated(true);
            history.replace('/');
            window.location.reload();
        }).catch(error => {
            console.log('error',error);
        });

    },[data]);

    const handleEnter = useCallback((e) => {
        if(e.code === 'Enter'){
            handleLogin();
        }
    },[handleLogin]);

    return (
        <CommonModal
            {...p}
            size={'350px'}
            title={'Log in'}
            btnText={'submit'}
            btnType={'submit'}
            titleAlign={'center'}
            btnAlign={'center'}
            formData={data}
            setAuthenticated={p.setAuthenticated}
            setError={setError}
            handler={handleLogin}
        >
            <Content>
                <TextField
                    error={error}
                    helperText={error}
                    label="Email"
                    variant="outlined"
                    onChange={e => handleChange(e, 'email')}
                    onKeyPress={handleEnter}
                />
                <TextField
                    error={error}
                    helperText={error}
                    label="Password"
                    variant="outlined"
                    onChange={e => handleChange(e, 'password')}
                    autoComplete="off"
                    type="password"
                    onKeyPress={handleEnter}
                />
                {/* <Link width={'130px'} left={'180px'} onClick={searchForgotPW}>
                    Forgot password?
                </Link> */}
            </Content>
        </CommonModal>
    );
};

export default LoginModal;

const Content = styled.div`
    display: flex;
    flex-direction: column;

    padding: 20px 20px 80px 20px;
    > div {
        margin: 15px 0;
    }
`;

const Link = styled.a`
    position: relative;
    left: ${p => p.left};
    width: ${p => p.width};
    text-align: right;
    cursor: pointer;
    color: ${p => p.theme.subColor};
    text-decoration: underline ${p => p.theme.subColor};
    margin-top: 10px;
    :hover {
        opacity: 0.8;
    }
`;
