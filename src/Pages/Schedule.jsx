import styled from "@emotion/styled";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../Components/Button";
import Schedule from "../Components/Schedule/Schedule";
import { BREAKPOINT_L, BREAKPOINT_MD, BREAKPOINT_XS, DATE_FORMAT } from "../config";
dayjs.extend(utc);

const Container = styled.div`
> section:first-of-type {
    border-radius: 0;
    h3 {
        padding: 0 0 4rem 0;
        @media (max-width: ${BREAKPOINT_XS}px) {
            padding: 0 0 1rem 0;
        }
    }
}
.spacer {
    height: 90vh;
}
.controls {
    position: sticky;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: var(--grey);
    display: flex;
    justify-content: space-between;
    gap: 2rem;
    align-items: center;
    padding: 2rem;
    button {
        background: transparent;
        line-height: 2rem;
        box-sizing: border-box;
        color: var(--second);
        padding: 0 1rem;
        border-color: var(--second);
    }
    @media (max-width: ${BREAKPOINT_L}px) {
        grid-template-columns: repeat(3, minmax(0,1fr));
    }
    @media (max-width: ${BREAKPOINT_MD}px) {
        span {
            display: none;
        }
        button {
            padding: 0;
            width: calc(3rem + 2px);
            height: calc(3rem + 2px);
            text-align: center;
            align-items: center;
            display: inline-flex;
            justify-content: center;
        }
    }
}
`

const SchedulePage = () => {

    const { from } = useParams();
    const navigate = useNavigate()

    const current = dayjs(from);
    const previous = current.subtract(7, "days")
    const next = current.add(7, "days")

    const gotoPreviousWeek = () => {
        navigate("/schedule/" + previous.format("YYYYMMDD"))
    }
    const gotoNextWeek = () => {
        navigate("/schedule/" + next.format("YYYYMMDD"))
    }
    return (
        <Container>
            <Schedule from={from} inverted />
            <div className="spacer">
                &nbsp;
            </div>
            <div className="controls">
                <Button large onClick={() => gotoPreviousWeek()}>&laquo; <span>{previous.format(DATE_FORMAT)}</span></Button>
                <div>{current.format("DD.MM")}&mdash;{current.add(6, "days").format("DD.MM")} <span>{current.add(6, "days").format("YYYY")}</span></div>
                <Button large onClick={() => gotoNextWeek()}><span>{next.format(DATE_FORMAT)}{" "}</span>&raquo;</Button>
            </div>
        </Container>
    )
}

export default SchedulePage;