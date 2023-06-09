import styled from "@emotion/styled";
import React from "react";
import { Link } from "react-router-dom";
import { BREAKPOINT_XS } from "../../config";
import { getTimeRangeString } from "../../utils";

const Container = styled.div`
        padding-right: 2rem;
        display: flex;
        align-items: center;
        gap: 1rem;
        @media (max-width: ${BREAKPOINT_XS}px) {
            gap: 0;
            flex-direction: column-reverse;
            align-items: flex-start;
        }

    span {
        font-size: 1rem;
        flex: 7rem 0 0;
        @media (max-width: ${BREAKPOINT_XS}px) {
            flex: auto;
            margin-bottom: 1rem;
        }
    }
    a {
        text-transform: initial;

        &:hover {
            color: var(--second);
        }
    }
`;

const ScheduleBroadcast = ({ broadcast }) => {
    return (
        <Container>
            <span>
                {getTimeRangeString(broadcast.begin, broadcast.end)}
            </span>{" "}
            <Link to={`../broadcasts/${broadcast._meta.uid}`}>{broadcast.hostedby.title}</Link>
        </Container>
    );
};

export default ScheduleBroadcast;