import styled from "@emotion/styled";
import React from "react";
import { Link } from "react-router-dom";
import { getTimeRangeString } from "../../utils";

const Container = styled.div`
        padding-right: 2rem;
        display: flex;
        align-items: center;
        gap: 1rem;

    span {
        font-size: 1rem;
        flex: 7rem 0 0;
    }
    a {
        text-transform: initial;

        &:hover {
            color: var(--second);
        }
    }
`;

const ScheduleHistoricalBroadcast = ({ broadcast }) => {
    return (
        <Container>
            <span>
                {getTimeRangeString(broadcast.begin, broadcast.end)}
            </span>{" "}
            <Link to={`../broadcasts/${broadcast.prismicId}`}>{broadcast.hostedBy}</Link>
        </Container>
    );
};

export default ScheduleHistoricalBroadcast;