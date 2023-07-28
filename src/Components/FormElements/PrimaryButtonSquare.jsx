import styled from "@emotion/styled";

const Container = styled.button`
    line-height: 2rem;
    word-break: keep-all;
    white-space: nowrap;
    width: 2rem;
    padding: 0;
    cursor: pointer;
    box-sizing: border-box;
    text-transform: uppercase;
    background-color: var(--second);
    color: var(--background);
    border: 1px solid var(--second);
    text-align: center;
`

const PrimaryButtonSquare = ({ children, ...props }) => {
    return (<Container {...props}>
        {children}
    </Container>)
}

export default PrimaryButtonSquare;