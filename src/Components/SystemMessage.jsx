import styled from "@emotion/styled";
import clsx from "clsx";
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
&.small {
    font-size: 1rem;
    padding:1rem 2rem;
}

`;

const SystemMessage = ({ message, type, small, children, props }) => {
    return (
        <Container className={clsx({ error: type === "error" ? true : "", warning: type === "warning" ? true : "", info: type === "info" ? true : "", small })} {...props}>
            <span>
                {message}
            </span>
            {children}
        </Container>
    )
}

export default SystemMessage;