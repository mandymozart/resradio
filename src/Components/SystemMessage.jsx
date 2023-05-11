import styled from "@emotion/styled";
import React from "react";

export const Container = styled.div`
padding: 6rem 2rem;
text-align: center;
&.error {
    color: var(--red);
}
&.warning {
    color: var(--second);
}
&.info {}

`;

const SystemMessage = ({ message, type, children, props }) => {
    return (
        <Container className={type} {...props}>
            <span>
                {message}
            </span>
            {children}
        </Container>
    )
}

export default SystemMessage;