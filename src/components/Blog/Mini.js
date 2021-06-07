import React from 'react';
import {useHistory} from 'react-router-dom';
import styled from 'styled-components';

const Mini = ({post, ...p}) => {
    const history = useHistory();

    const moveToPage = () => {
        history.push({
            pathname: `/detail/${post.id}`,
            state: post,
        });
    };

    return (
        <Box onClick={moveToPage}>
            <Title>{post.title}</Title>
            <CreateWrapper>
                <Create>
                    <span>{'seunghyun'}</span>
                    <span>{post.addedAt}</span>
                </Create>
            </CreateWrapper>
        </Box>
    );
};

export default React.memo(Mini);

const Box = styled.div`
    display: flex;
    flex-direction: column;
    padding: 20px;
    border-radius: 0.25rem;

    background-color: rgba(255, 255, 255, 0.6);

    :hover {
        cursor: pointer;
        opacity: 0.8;
        transform: scale(1.04);
        transition: transform 250ms;
    }
`;

const Title = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    color: #343a40;
`;

const CreateWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-top: 1rem;
`;

const Create = styled.div`
    color: #1e1e1e;
    background-color: #f8f9fa;
    border-radius: 3rem;
    padding: 2px 0 2px 10px;
    > span {
        padding-right: 10px;
    }
`;
