import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import {ThemeProvider} from 'styled-components';
import theme from 'theme';
import Routes from './routes';
import HideProvider from 'Context/hide/HideProvider';
import 'style.scss';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

ReactDOM.render(
    <HideProvider>
        <ThemeProvider theme={theme}>
            <Routes />
        </ThemeProvider>
    </HideProvider>,
    document.getElementById('root')
);
