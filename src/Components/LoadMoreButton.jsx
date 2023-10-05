import styled from "@emotion/styled";
import React from "react";
import { GoChevronDown } from "react-icons/go";
import Button from "./Button";
import SectionLoader from "./SectionLoader";

const Container = styled(Button)`
    font-size: 1rem;
    text-transform: uppercase;
    border: none;
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 7.5rem;
    svg {
        font-size: 3rem;
    }
    &:hover {
        color: var(--second);
    }
`;

const LoadMoreButton = ({ children, loading, ...props }) => {
    if (loading) return <SectionLoader />
    return <Container {...props}>
        {children ? children : "load more"}
        <GoChevronDown />
    </Container>
}

export default LoadMoreButton;