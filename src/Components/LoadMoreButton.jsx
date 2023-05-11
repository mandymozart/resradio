import styled from "@emotion/styled";
import React from "react";
import BigArrow from "../images/BigArrow";
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
        margin-top: 1rem;
    }
`;

const LoadMoreButton = ({ children, loading, ...props }) => {
    if (loading) return <SectionLoader />
    return <Container {...props}>
        {children ? children : "load more"}
        <BigArrow />
    </Container>
}

export default LoadMoreButton;