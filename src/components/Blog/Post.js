import React, {useState, useCallback, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import styled from 'styled-components';
import marked from 'marked';

import Makrdown from 'components/Markdown';
import Tags from 'components/Blog/Tags';
import ButtonBase from 'components/Parts/Button';

const API_HOST = process.env.REACT_APP_URL;

const Post = ({post, ...p}) => {
    const history = useHistory();
    const [markdown, setMarkdown] = useState('');
    const moveToPage = useCallback(() => {
        history.push({
            pathname: `/detail/${post.id}`,
            state: post,
        });
    }, [history, post]);

    useEffect(() => {
        const getMarkedPost = () => {
            fetch(`${API_HOST}/markdown/${post.filename}.md`)
                .then(res => res.text())
                .then(text => {
                    setMarkdown(marked(text));
                });
        };
        getMarkedPost();
        return getMarkedPost();
    }, [post.filename, history]);

    return (
        <Box {...p}>
            <Img src={post.thumbnail} alt="image" />
            <Title>{post.title}</Title>
            <SubTitle>{post.subTitle}</SubTitle>
            <StyleMD children={markdown} />
            <Tags list={post.tags} />
            <ReadMore onClick={moveToPage}>Read More</ReadMore>
        </Box>
    );
};

export default Post;

const Title = styled.h1`
    font-size: 2rem !important;
    margin: 0 0 1rem 0 !important;
`;

const SubTitle = styled.h5`
    font-size: 1.5rem !important;
    margin: 0 !important;
    opacity: 0.5;
`;

const StyleMD = styled(Makrdown)`
    display: -webkit-box;
    text-overflow: ellipsis;
    overflow: hidden;
    -webkit-line-clamp: 6; /* 라인수 */
    -webkit-box-orient: vertical;
    word-wrap: break-word;
`;

const Box = styled.div`
    display: flex;
    flex-direction: column;
    max-width: 820px;
    position: relative;

    background-color: #ffffff;
    background-clip: border-box;
    border: 1px solid rgba(0, 0, 0, 0.125);
    border-radius: 0.25rem;

    > :not(:first-child) {
        padding: 0 1.25rem;
    }

    > * {
        margin-bottom: 1.5rem;
    }
`;

const Img = styled.img.attrs(() => ({
    alt: 'image',
}))``;

const ReadMore = styled(ButtonBase)`
    width: 130px;
    margin: 0 1.25rem 1.5rem 1.2rem;
    padding: 10px 1.25rem 9px !important;
    font-size: 1rem;
    color: #fff;
    background-color: #007bff;
    border-color: #007bff;

    ::after {
        margin-left: 5px;
        content: '→';
    }
`;

const Created = styled.footer``;
