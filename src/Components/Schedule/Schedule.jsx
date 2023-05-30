import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import gql from "graphql-tag";
import React from "react";
import { BroadcastFragment, BroadcastTagsFragment, GetBroadcastsInRangeQuery } from "../../Queries/broadcasts";
import { DATE_FORMAT } from "../../config";
import palm from "../../images/palm.png";
import ScheduleBroadcast from "../Broadcasts/ScheduleBroadcast";
import SectionLoader from "../SectionLoader";
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
        const d = dayjs(b.node.begin).format('dddd, ' + DATE_FORMAT);
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
        console.log(dayjs(b.node.begin).format('dddd, ' + DATE_FORMAT), days, broadcasts)

        if (days.find(d => d.date === dayjs(b.node.begin).format('dddd, ' + DATE_FORMAT)))
            days.find(d => d.date === dayjs(b.node.begin).format('dddd, ' + DATE_FORMAT)).broadcasts.push(b)
        else console.error("date string mismatch")

    })
    return days
}

const Container = styled.section`
    border-radius: 1.5rem;
    background-color: var(--color);
    color: var(--background);
    padding: 2rem;
    grid-row: span 2;
    /* border-bottom: 2px solid var(--color); */
    h3 {
        margin-bottom: 0;
    }

    .list {
        margin-top: 4rem;
    
    }
    p {
        display: flex;margin: 0;
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
    `;

const Schedule = ({ from }) => {

    const start = from ? dayjs(from) : dayjs().format('YYYY-MM-DD');
    const after = dayjs(start)
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
