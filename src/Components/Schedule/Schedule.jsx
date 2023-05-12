import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import utc from "dayjs/plugin/utc";
import gql from "graphql-tag";
import React from "react";
import { BroadcastFragment, BroadcastTagsFragment, GetBroadcastsInRangeQuery } from "../../Queries/broadcasts";
import { BREAKPOINT_L, BREAKPOINT_MD, BREAKPOINT_XS } from "../../config";
import palm from "../../images/palm.png";
import { DATE_FORMAT } from "../../utils";
import ScheduleBroadcast from "../Broadcasts/ScheduleBroadcast";
import SectionLoader from "../SectionLoader";
dayjs.extend(isBetween);
dayjs.extend(utc);

const getBroadcastsInRangeQuery = gql`
${GetBroadcastsInRangeQuery}
${BroadcastFragment}
${BroadcastTagsFragment}
`

const mapBroadcastsToDays = (broadcasts) => {
    let days = [];
    let day = "";
    let count = 0;
    broadcasts.forEach(function (b) {
        const d = dayjs(b.node.begin).format('ddd, ' + DATE_FORMAT);
        console.log(d, day)
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
        console.log(dayjs(b.node.begin).format('ddd, ' + DATE_FORMAT), days, broadcasts)

        if (days.find(d => d.date === dayjs(b.node.begin).format('ddd, ' + DATE_FORMAT)))
            days.find(d => d.date === dayjs(b.node.begin).format('ddd, ' + DATE_FORMAT)).broadcasts.push(b)
        else console.error("date string mismatch")

    })
    return days
}

const Container = styled.section`
    
    padding: 2rem;
    /* border-bottom: 2px solid var(--color); */
    h3 {
        margin-bottom: 0;
    }

    .list {
        margin-top: 4rem;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr;
        @media (max-width: ${BREAKPOINT_L}px) {
            grid-template-columns: 1fr 1fr 1fr;
        }
        @media (max-width: ${BREAKPOINT_MD}px) {
            grid-template-columns: 1fr 1fr;
        }
        @media (max-width: ${BREAKPOINT_XS}px) {
            grid-template-columns: 1fr;
        }
        gap: 0;
    
    }
    p {
        display: flex;margin: 0;
    }
    h4 {
        font-family: var(--font-light);
        font-size: 1.5rem;
        text-transform: uppercase;
        text-transform: initial;
        line-height: 3rem;
        margin-bottom: 1rem;
        margin-top: 1rem;
        border-bottom: 2px solid var(--color);
    }`;

const Schedule = ({ from }) => {

    const start = from ? dayjs(from) : dayjs().format('YYYY-MM-DD');
    const after = dayjs(start).subtract(7, 'days')
    const { loading, error, data } = useQuery(
        getBroadcastsInRangeQuery,
        {
            variables:
            {
                endAfter: after.format(),
                beginBefore: after.add(7, 'days').format(),
            }
        });



    if (loading) return <SectionLoader />;
    if (error) return <>Error : {error.message}</>;
    const days = mapBroadcastsToDays(data.allBroadcastss.edges)
    return (
        <Container>

            <h3>Schedule</h3>
            <p>our weekly updated schedule (UTC+2)</p>
            {days.length < 1 && (<p>
                No upcoming shows scheduled. It's possible, that we might be on vacation.
                <img src={palm} alt="vacation" />
            </p>)}
            <div className="list">
                {days?.map((day) => {
                    return (<div className="list-day">
                        <h4>{day.date}</h4>
                        {day.broadcasts?.map(broadcast => <ScheduleBroadcast key={broadcast.node._meta.id} broadcast={broadcast.node} />)}
                    </div>)
                })}
            </div>
        </Container >
    );
};

export default Schedule;
