import React, {useState, useCallback, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import {TextField} from '@material-ui/core';

import CommonModal from './CommonModal';
import { checkEmail } from 'utils/checker'; 

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const SignupModal = ({...p}) => {
    const [error, setError] = useState(false);

    const [data, setData] = useState({
        email: '',
        name: '',
        password: '',
        password2: '',
    });

    const handleChange = useCallback(
        (e, target) => {
            setData({
                ...data,
                [target]: e.target.value,
            });
        },
        [data, setData]
    );
    useEffect(() => {
        setError(false);
    }, [p.open]);

    const handleSignup = () => {
        if (data.email.length < 1 && data.password.length < 1) return;
        if (!checkEmail(data.email)) return window.alert('이메일 형식이 올바르지 않습니다.');
        if (data.password !== data.password2) return window.alert('비밀번호가 일치하지 않습니다.');

        if(data.email.length === 0) {
            return window.alert('이메일을 입력해주세요.');
        }
        if(data.name.length === 0) {
            return window.alert('이름을 입력해주세요.');
        }
        if(data.password.length === 0) {
            return window.alert('비밀번호를 입력해주세요.');
        }
        if(data.password2.length === 0) {
            return window.alert('비밀번호를 입력해주세요.');
        }

        const register = async () => {
            const response = await axios.post(`${SERVER_URL}/register`, {
                email: data.email,
                name: data.name,
                password: data.password,
            });
            return response.data;
        };
        register().then(res => {
            p.setOpen(false);
        });
    };

    return (
        <CommonModal
            {...p}
            size={'350px'}
            title={'Sign Up'}
            btnText={'submit'}
            btnType={'submit'}
            titleAlign={'center'}
            btnAlign={'center'}
            formData={data}
            setAuthenticated={p.setAuthenticated}
            setError={setError}
            handler={handleSignup}
        >
            <Content>
                <TextField
                    error={!!error}
                    helperText={error}
                    label="Email*"
                    variant="outlined"
                    onChange={e => handleChange(e, 'email')}
                />
                <TextField
                    error={!!error}
                    helperText={error}
                    label="User name*"
                    variant="outlined"
                    onChange={e => handleChange(e, 'name')}
                />
                <TextField
                    error={!!error}
                    helperText={error}
                    label="Password*"
                    variant="outlined"
                    onChange={e => handleChange(e, 'password')}
                    autoComplete="off"
                    type="password"
                />
                <TextField
                    error={!!error}
                    helperText={error}
                    label="Password again*"
                    variant="outlined"
                    onChange={e => handleChange(e, 'password2')}
                    autoComplete="off"
                    type="password"
                />
            </Content>
        </CommonModal>
    );
};

export default SignupModal;

const Content = styled.div`
    display: flex;
    flex-direction: column;

    padding: 20px 20px 80px 20px;
    > div {
        margin: 15px 0;
    }
`;
