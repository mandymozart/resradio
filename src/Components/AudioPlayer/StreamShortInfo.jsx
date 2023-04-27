import { useChannel, usePresence } from "@ably-labs/react-hooks";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import utc from "dayjs/plugin/utc";
import gql from "graphql-tag";
import React, { useState } from "react";
import { BroadcastFragment, BroadcastTagsFragment, GetBroadcastsInRangeQuery } from "../../Queries/broadcasts";
import useBroadcastStore from "../../Stores/BroadcastStore";
import config from "../../config";
import Dot from "../../images/Dot";
import { trimZeros } from "../../utils";
dayjs.extend(isBetween);
dayjs.extend(utc);

const Container = styled.div`
.now {
  color: var(--second);
}
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
${BroadcastTagsFragment}
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
  useChannel(config.ABLY_ROTATION_CHANNEL, (message) => {
    setRotationInfo(message)
  });
  usePresence(config.ABLY_ROTATION_CHANNEL, "listener");

  if (loading) return <Container>...</Container>;
  if (error) return <>Error : {error.message}</>;
  if (data.allBroadcastss.edges > 0)
    setCurrentBroadcast(data.allBroadcastss.edges[0].node)
  if (data.allBroadcastss.edges[1]) setNextBroadcast(data.allBroadcastss.edges[1].node);
  return (
    <Container>
      {currentBroadcast ? (
        <>
          <span className="now">Now<Dot /></span> {currentBroadcast.hostedby._meta.uid} &mdash; {currentBroadcast.title}
        </>
      ) : (
        <>
          {rotationInfo ? (
            <>
              {trimZeros(dayjs(rotationInfo.data.current.begin))}&mdash;{trimZeros(dayjs(rotationInfo.data.current.end))} {dayjs(rotationInfo.data.current.end).format("A")} {rotationInfo.data.current.hostedby}&mdash;{rotationInfo.data.current.title}
            </>
          ) : (<>Radio Offline</>)}
        </>
      )}
    </Container>
  );
};

export default StreamShortInfo;
