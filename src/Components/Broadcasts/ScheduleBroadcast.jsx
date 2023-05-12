import styled from "@emotion/styled";
import dayjs from "dayjs";
import React from "react";
import { Link } from "react-router-dom";
import { trimZeros } from "../../utils";

const Container = styled.div`
padding-right: 2rem;
    span {
        font-size: 1rem;
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
                {trimZeros(dayjs(broadcast.begin))}&mdash;{trimZeros(dayjs(broadcast.end))} {dayjs(broadcast.end).format("A")}
            </span>{" "}
            <Link to={`../broadcasts/${broadcast._meta.uid}`}>{broadcast.hostedby.title}</Link>
        </Container>
    );
};

export default ScheduleBroadcast;