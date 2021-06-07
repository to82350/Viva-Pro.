import React from 'react';
import styled from 'styled-components';

import ButtonBase from 'components/Parts/Button';

const StickyBox = ({categories, onClickSearch}) => {
    return (
        <Wrapper>
            <CardBox>
                <CardHeader>Search</CardHeader>
                <CardBody>
                    <SearchInput />
                    <StyledButton>GO!</StyledButton>
                </CardBody>
            </CardBox>
            {categories && (
                <CardBox>
                    <CardHeader>Categories</CardHeader>
                    <Categories>
                        {categories.map((category, idx) => (
                            <li key={idx}>
                                <button
                                    onClick={() => onClickSearch(category.name)}
                                >{`${category.name} (${category.cnt})`}</button>
                            </li>
                        ))}
                    </Categories>
                </CardBox>
            )}
        </Wrapper>
    );
};

export default StickyBox;

const Wrapper = styled.div`
    margin-top: 3.5rem;
`;

const CardBox = styled.div`
    display: flex;
    flex-direction: column;
    border: 1px solid rgba(0, 0, 0, 0.125);
    border-radius: 0.25rem;
    margin-bottom: 2rem;
`;

const CardHeader = styled.div`
    padding: 12px 20px;
    font-size: 1.25rem;
    font-weight: 500;
    line-height: 1.2;
    background-color: rgba(0, 0, 0, 0.03);
`;

const CardBody = styled.div`
    display: flex;
    padding: 1.25rem;
`;

const Categories = styled(CardBody)`
    flex-direction: column;
    > li {
        margin-bottom: 1rem;
    }
    > li > button {
        font-size: 1rem;
        outline: none;
        border: none;
        background-color: #ffffff;
        color: dodgerblue;
        :hover {
            cursor: pointer;
            text-decoration: underline;
            opacity: 0.8;
        }
    }
`;

const SearchInput = styled.input.attrs(() => ({
    placeholder: 'Search for...',
}))`
    width: 100%;
    padding: 5px;
    font-size: 1rem;
`;

const StyledButton = styled(ButtonBase)`
    padding: 10px;
    font-size: 1rem;
    font-weight: 500;
    color: #ffffff;
    background-color: #6c757d;
`;
