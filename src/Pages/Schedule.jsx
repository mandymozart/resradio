import styled from "@emotion/styled";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../Components/Button";
import HeaderOffset from "../Components/HeaderOffset";
import Schedule from "../Components/Schedule/Schedule";
import { BREAKPOINT_L, BREAKPOINT_MD, DATE_FORMAT } from "../config";
dayjs.extend(utc);

const Container = styled.div`
padding: 2rem;
.controls {
    display: flex;
    gap: 2rem;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 2rem;
    button {
        border-radius: 1.5rem; 
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
    return (<HeaderOffset>
        <Container>
            <div className="controls">
                <Button large onClick={() => gotoPreviousWeek()}>&lt;&lt; <span>{previous.format(DATE_FORMAT)}</span></Button>
                <div>{current.format("DD.MM")}&mdash;{current.add(6, "days").format("DD.MM")} <span>{current.add(6, "days").format("YYYY")}</span></div>
                <Button large onClick={() => gotoNextWeek()}><span>{next.format(DATE_FORMAT)}</span> &gt;&gt;</Button>
            </div>
            <Schedule from={from} />
        </Container>

    </HeaderOffset>

    )
}

export default SchedulePage;