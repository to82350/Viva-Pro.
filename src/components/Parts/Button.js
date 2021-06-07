import styled from 'styled-components';
import React from 'react';

const Button = styled.div`
    border-radius: 0.25rem;
    font-size: 12px;
    letter-spacing: -0.36px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 6px 10px;
    outline: none;
    cursor: pointer;
    user-select: none;
    transition: all 0.1s linear;
    :hover {
        opacity: 0.8;
    }

    ${p =>
        p.btnType === 'submit' &&
        `
        width: 250px;
        padding: 16px;
        font-size: 16px;
        color: #ffffff;
        background-color: ${p.theme.gdacColor};

    `};

    ${p =>
        p.btnType === 'close' &&
        `
        padding: 12px 16px;
        color: #ffffff;
        background-color: #6c757d;
        border-color: #6c757d;
    `};
`;

const ButtonBase = ({children, ...p}) => {
    return <Button {...p}>{children}</Button>;
};

export default ButtonBase;
