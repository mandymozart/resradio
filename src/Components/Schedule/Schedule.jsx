import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import clsx from "clsx";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import React, { useEffect, useState } from "react";
import { useNetlifyIdentity } from "react-netlify-identity";
import { getBroadcastsQuery } from "../../Queries/broadcasts";
import { BREAKPOINT_XS, DATE_FORMAT, FUNCTIONS } from "../../config";
import { convertToZuluTimeString } from "../../utils";
import ScheduleBroadcast from "../Broadcasts/ScheduleBroadcast";
import ScheduleHistoricalBroadcast from "../Broadcasts/ScheduleHistoricalBroadcast";
import SectionLoader from "../SectionLoader";
dayjs.extend(utc);

const mapBroadcastsToDays = (broadcasts) => {
    let days = [];
    let day = "";
    let count = 0;
    broadcasts.forEach(function (b) {
        const d = dayjs(b.node.begin).format('dddd, ' + DATE_FORMAT);
        count++;
        if (day !== d && count === 1) {
            day = d;
            days.push({ date: d, broadcasts: [] })
        } else {
            count = 0;
        }
    })
    return populateDays(days, broadcasts);
}

const populateDays = (days, broadcasts) => {
    broadcasts.forEach(function (b) {
        if (days.find(d => d.date === dayjs(b.node.begin).format('dddd, ' + DATE_FORMAT)))
            days.find(d => d.date === dayjs(b.node.begin).format('dddd, ' + DATE_FORMAT)).broadcasts.push(b)
        else console.error("date string mismatch")

    })
    return days
}

const mapHistoricalBroadcastsToDays = (broadcasts) => {
    let days = [];
    let day = "";
    let count = 0;
    broadcasts.forEach(function (b) {
        const d = dayjs(b.begin).format('dddd, ' + DATE_FORMAT);
        count++;
        if (day !== d && count === 1) {
            day = d;
            days.push({ date: d, broadcasts: [] })
        } else {
            count = 0;
        }
    })
    return populateHistoricalDays(days, broadcasts);
}

const populateHistoricalDays = (days, broadcasts) => {
    broadcasts.forEach(function (b) {
        if (days.find(d => d.date === dayjs(b.begin).format('dddd, ' + DATE_FORMAT)))
            days.find(d => d.date === dayjs(b.begin).format('dddd, ' + DATE_FORMAT)).broadcasts.push(b)
        else console.error("date string mismatch")

    })
    return days
}

const Container = styled.section`
    border-radius: 1.5rem;
    background-color: var(--color);
    color: var(--background);
    &.inverted {
        background-color: var(--background);
        color: var(--color);
        a {
            color: var(--color);
            &:hover {
                color: var(--second);
            }
        }
    }
    padding: 2rem;
    @media (max-width: ${BREAKPOINT_XS}px) {
        padding: 1rem;
        font-size: 1rem;
    }
    grid-row: span 2;
    /* border-bottom: 2px solid var(--color); */
    h2 {
        margin-bottom: 0;
        @media (max-width: ${BREAKPOINT_XS}px) {
            font-size: 1.5rem;
        }
    }
    p {
        margin-top: 0;
        font-size: 1rem;;
    }

    .list {
        margin-top: 4rem;
    
    }
    .notice {
        font-size: 1.5rem;
        margin-top: 3rem;
        img {
            margin-top: 4rem;
        }
        @media (max-width: ${BREAKPOINT_XS}px) {
            font-size: 1rem;
        }
    }
    a {
        color: var(--background);
    }
    h4 {
        font-family: var(--font-light);
        font-size: 1.5rem;
        text-transform: uppercase;
        line-height: 3rem;
        margin-bottom: 1rem;
        margin-top: 2rem;
    }
    h3 {
        margin-top: 2rem;
        margin-bottom: 1rem;
    }
    `;

const Schedule = ({ from, inverted }) => {
    const { isLoggedIn } = useNetlifyIdentity()
    const start = from ? dayjs(from) : dayjs().format('YYYY-MM-DD');
    const after = dayjs(start)
    const { loading, error, data } = useQuery(
        getBroadcastsQuery,
        {
            variables:
            {
                endAfter: after.format(),
                sortBy: "begin_ASC",
                beginBefore: after.add(7, 'days').format(),
            }
        });

    const [history, setHistory] = useState([]);
    const getBroadcastHistory = async () => {
        const res = await fetch(`${FUNCTIONS}/broadcasts?beginBefore=${convertToZuluTimeString(after.add(7, 'days').utc())}&endAfter=${convertToZuluTimeString(after.utc())}&from=0&to=100`)
        const history = await res.json()
        setHistory(history)
    }

    useEffect(() => {
        getBroadcastHistory()
    }, [from])


    if (loading) return <SectionLoader />;
    if (error) return <>Error : {error.message}</>;
    const days = mapBroadcastsToDays(data.allBroadcastss.edges)
    return (
        <Container className={clsx({ inverted: inverted })}>
            <h2>Schedule</h2>
            <p>our weekly updated schedule (UTC+2)</p>
            {days.length < 1 && (<p className="notice">
                No broadcasts found! Try adjusting the time frame.
            </p>)}
            <div className="list">
                {days?.map((day) => {
                    return (<div className="list-day" key={day.date + "regular"}>
                        <h4>{day.date}</h4>
                        {day.broadcasts?.map(broadcast => <ScheduleBroadcast key={broadcast.node._meta.id} broadcast={broadcast.node} />)}
                    </div>)
                })}
                {isLoggedIn && (
                    <>
                        <h3>Reruns</h3>
                        {mapHistoricalBroadcastsToDays(history).map((day, index) => {
                            if (day.broadcasts.length < 1) return
                            return (<div className="list-day" key={day.date + "historical"}>
                                <h4>{day.date}</h4>
                                {day.broadcasts?.map(broadcast => <ScheduleHistoricalBroadcast key={broadcast.prismicId + index} broadcast={broadcast} />)}
                            </div>)
                        })}
                    </>
                )}
            </div>
        </Container >
    );
};

export default Schedule;
