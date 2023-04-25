import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import utc from "dayjs/plugin/utc";
import gql from "graphql-tag";
import React from "react";
import { Link } from "react-router-dom";
import { BroadcastFragment, BroadcastTagsFragment, GetBroadcastsInRangeQuery } from "../../Queries/broadcasts";
import palm from "../../images/palm.png";
import { trimZeros } from "../../utils";
import SectionLoader from "../SectionLoader";
dayjs.extend(isBetween);
dayjs.extend(utc);

const getBroadcastsInRangeQuery = gql`
${GetBroadcastsInRangeQuery}
${BroadcastFragment}
${BroadcastTagsFragment}
`

const Container = styled.section`
    
    padding: 2rem;
    border-bottom: 2px solid var(--color);
    h3 {
        margin-bottom: 0;
    }

    .list {
        margin-top: 4rem;
        display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 2rem;
    
    a {
        color: var(--second);
        &:hover {
            color: var(--color);
        }
    }
    }
    p {
        display: flex;margin: 0;
    }
    h4 {
        font-family: var(--font-medium);
        font-size: 2rem;
        margin: 3rem 0 0 0;
        text-transform: initial;
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

    let day = "";
    let count = 0;
    const getWeekdayHeadline = (begin) => {
        const d = dayjs(begin).format('ddd, D.M.YYYY');
        count++;
        if (day !== d && count === 1) {
            day = d;
            return (<h4>{d}</h4>)
        } else {
            count = 0;
            return (<></>);
        }

    }

    if (loading) return <SectionLoader />;
    if (error) return <>Error : {error.message}</>;
    const broadcasts = data.allBroadcastss.edges
    return (
        <Container>

            <h3>Schedule</h3>
            <p>our weekly updated schedule</p>
            {broadcasts.length < 1 && (<p>
                No upcoming shows scheduled. It's possible, that we might be on vacation.
                <img src={palm} alt="vacation" />
            </p>)}
            <div className="list">
                {broadcasts?.map((broadcast) => {
                    return (<>
                        {getWeekdayHeadline(broadcast.node.begin)}
                        <ScheduleBroadcast key={broadcast.node._meta.id} broadcast={broadcast.node} />
                    </>)
                })}
            </div>
        </Container>
    );
};

const ScheduleBroadcastContainer = styled.div`
    grid-template-columns: 1fr 2fr;
    display: grid;
    a {
        text-transform: initial;
    }
`;

const ScheduleBroadcast = ({ broadcast }) => {
    return (
        <ScheduleBroadcastContainer>
            <div>
                {trimZeros(dayjs(broadcast.begin))}&mdash;{trimZeros(dayjs(broadcast.end))} {dayjs(broadcast.end).format("A")}
            </div>
            <Link to={`../broadcasts/${broadcast._meta.uid}`}>{broadcast.hostedby.title} - {broadcast.title}</Link>
        </ScheduleBroadcastContainer>
    );
};


export default Schedule;
