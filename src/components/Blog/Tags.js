import React, {useCallback} from 'react';
import {useHistory, useLocation} from 'react-router-dom';
import qs from 'querystring';
// import axios from 'axios';
import styled from 'styled-components';
import {AiFillTags} from 'react-icons/ai';

import Button from 'components/Parts/Button';

const Tag = ({children, onClickSearch, ...p}) => {
    // return <Wrapper onClick={() => onClickSearch(children)}># {children}</Wrapper>;
    return <Wrapper># {children}</Wrapper>;
};

// tag의 데이터 만큼 mapping
const Tags = ({list, ...p}) => {
    const history = useHistory();

    const handleClickSearch = useCallback(
        text => {
            history.push({
                pathname: '/blog',
                search: qs.stringify({q: text}),
            });
        },
        [history]
    );

    return (
        <Container {...p}>
            <Icon />
            {list.map((tag, idx) => (
                // <Tag key={idx} children={tag} onClickSearch={handleClickSearch} />
                <Tag key={idx} children={tag} />
            ))}
        </Container>
    );
};

export default Tags;

const Container = styled.div`
    display: flex;
    align-items: center;
`;

const Wrapper = styled(Button)`
    margin-right: 0.5rem;
    font-weight: 600;
    letter-spacing: 0.5px;
    background-color: #f8f9fa;
`;

const Icon = styled(AiFillTags)`
    font-size: 1.5rem;
    margin-right: 0.5rem;
`;
