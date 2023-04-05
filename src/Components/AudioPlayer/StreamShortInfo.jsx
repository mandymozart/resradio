import { useChannel, usePresence } from "@ably-labs/react-hooks";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import utc from "dayjs/plugin/utc";
import gql from "graphql-tag";
import React, { useState } from "react";
import Dot from "../../images/Dot";
import { BroadcastFragment, BroadcastTagsFragement, GetBroadcastsInRangeQuery } from "../../Queries/broadcasts";
import useBroadcastStore from "../../Stores/BroadcastStore";
dayjs.extend(isBetween);
dayjs.extend(utc);

const Container = styled.div`
 flex: 1;
 span {
  font-family: var(--font-bold);
  flex: 1;
  svg {
    color: var(--second);
  }
 }
 justify-content: center;
 align-items: center;
`;

export const getBroadcastsInRangeQuery = gql`
${GetBroadcastsInRangeQuery}
${BroadcastFragment}
${BroadcastTagsFragement}
`

const StreamShortInfo = () => {
  const { loading, error, data } = useQuery(
    getBroadcastsInRangeQuery,
    {
      variables:
      {
        endAfter: dayjs().format(),
        beginBefore: dayjs().format(),
      },
      pollInterval: 60 * 1000
    });
  const { currentBroadcast, setCurrentBroadcast, setNextBroadcast } = useBroadcastStore();

  // ably websocket
  const [rotationInfo, setRotationInfo] = useState();
  useChannel("rotation", (message) => {
    setRotationInfo(message)
  });
  usePresence("rotation", "listener");

  if (loading) return <Container>...</Container>;
  if (error) return <>Error : {error.message}</>;
  if (data.allBroadcastss.edges > 0)
    setCurrentBroadcast(data.allBroadcastss.edges[0].node)
  if (data.allBroadcastss.edges[1]) setNextBroadcast(data.allBroadcastss.edges[1].node);
  return (
    <Container>
      {currentBroadcast ? (
        <>
          <span>Now<Dot /></span> {currentBroadcast.hostedby._meta.uid} &mdash; {currentBroadcast.title}
        </>
      ) : (
        <>
          {rotationInfo ? (
            <>
              {dayjs(rotationInfo.data.begin).format("ddd, HH:mm")} - {dayjs(rotationInfo.data.end).format("HH:mm")} {rotationInfo.data.hostedby} &mdash; {rotationInfo.data.title}
            </>
          ) : (<>Radio Offline</>)}
        </>
      )}
    </Container>
  );
};

export default StreamShortInfo;
