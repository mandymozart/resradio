import styled from "@emotion/styled";
import { BREAKPOINT_XS } from "../../config";

const Container = styled.button`
    line-height: 2rem;
    word-break: keep-all;
    white-space: nowrap;
    padding: 0 1rem;
    cursor: pointer;
    box-sizing: border-box;
    text-transform: uppercase;
    background-color: var(--second);
    color: var(--background);
    border: 1px solid var(--second);
    @media(max-width: ${BREAKPOINT_XS}px) { 
        flex: 1;
        text-align: center;
    }
    &:hover {
        color: var(--background);
        background-color: var(--color);
        border-color: var(--color);
    }
`

const PrimaryButton = ({ children, ...props }) => {
    return (<Container {...props}>
        {children}
    </Container>)
}

export default PrimaryButton;