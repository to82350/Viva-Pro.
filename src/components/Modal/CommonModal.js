import React, {useState} from 'react';
import styled from 'styled-components';
import {Backdrop, Fade} from '@material-ui/core';

import Modal from 'components/Parts/Modal';
import Button from 'components/Parts/Button';

const CommonModal = ({
    children,
    btnText,
    title,
    open,
    setOpen,
    size,
    titleAlign,
    btnAlign,
    hBgColor,
    fBgColor,
    handler,
    btnType,
}) => {
    const handleCloseModal = () => {
        setOpen(false);
    };

    return (
        <Modal
            open={open}
            onClose={handleCloseModal}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
        >
            <Fade in={open}>
                <Container size={size}>
                    <Header hBgColor={hBgColor} titleAlign={titleAlign}>
                        <div>{title}</div>
                        <Close onClick={handleCloseModal}>x</Close>
                    </Header>
                    {children}
                    <Footer fBgColor={fBgColor} btnAlign={btnAlign}>
                        <Button btnType={btnType} onClick={handler}>
                            {btnText}
                        </Button>
                    </Footer>
                </Container>
            </Fade>
        </Modal>
    );
};

export default CommonModal;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    background-color: #ffffff;
    border-radius: 0.25rem;
    min-width: ${p => p.size || '500px'};
    max-width: ${p => p.size || '500px'};
    outline: none;
    border: none;
`;

const Header = styled.header`
    display: flex;
    ${({titleAlign}) => {
        if (titleAlign === 'left') {
            return `
                justify-content: flex-start;
            `;
        }

        if (titleAlign === 'right') {
            return `
                justify-content: flex-end;
            `;
        }

        return `
            justify-content: center;
        `;
    }};
    align-items: center;

    position: relative;

    padding: 20px;
    font-size: 24px;
    font-weight: 500;

    background-color: ${p => p.hBgColor || '#efefef'};
`;

const Footer = styled(Header)`
    ${({btnAlign}) => {
        if (btnAlign === 'left') {
            return `
                justify-content: flex-start;
            `;
        }

        if (btnAlign === 'right') {
            return `
                justify-content: flex-end;
            `;
        }

        return `
            justify-content: center;
        `;
    }};
    background-color: ${p => p.fBgColor || '#efefef'};
`;

const Close = styled.button`
    position: absolute;
    right: 20px;

    font-size: 25px;
    border-radius: 0.25rem;

    padding: 0 15px 2px 15px;

    color: #ffffff;
    background-color: #dc3545;

    ${p =>
        p.btnType === 'close' &&
        `
        color: #6c757d;
        background-color: #ffffff;
    `};

    :hover {
        opacity: 0.8;
    }
    cursor: pointer;
    border: none;
    outline: none;
`;
