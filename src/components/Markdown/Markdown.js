import React from 'react';
import styled from 'styled-components';
import ReactMarkdownWithHtml from 'react-markdown/with-html';

const Markdown = ({children, ...p}) => {
    return <StyledMD {...p} children={children} allowDangerousHtml />;
};

export default Markdown;

const StyledMD = styled(ReactMarkdownWithHtml)`
    h2 {
        color: gray;
    }
    pre {
        padding: 1rem;
        background-color: #efefef;
        overflow-x: scroll;
    }
    p {
        > code {
            background-color: #e83e8c;
            color: #ffffff;
            padding: 2px 8px;
            border-radius: 0.25rem;
            text-align: center;
        }
    }
`;
