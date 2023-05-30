import { useChannel, usePresence } from "@ably-labs/react-hooks";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import utc from "dayjs/plugin/utc";
import gql from "graphql-tag";
import React from "react";
import { BroadcastFragment, BroadcastTagsFragment, GetBroadcastsInRangeQuery } from "../../Queries/broadcasts";
import useBroadcastStore from "../../Stores/BroadcastStore";
import config from "../../config";
import Dot from "../../images/Dot";
import { getTimeRangeString } from "../../utils";
dayjs.extend(isBetween);
dayjs.extend(utc);

const Container = styled.div`
white-space: nowrap;
overflow: hidden;
text-overflow: ellipsis;
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
  const { currentBroadcast, setCurrentBroadcast, setNextBroadcast, setRotationInfo, rotationInfo, isLive } = useBroadcastStore();

  // ably websocket
  useChannel(config.ABLY_ROTATION_CHANNEL, (message) => {
    setRotationInfo(message)
  });
  usePresence(config.ABLY_ROTATION_CHANNEL, "listener");

  if (error) return <>Error : {error.message}</>;
  if (data?.allBroadcastss?.edges > 0)
    setCurrentBroadcast(data.allBroadcastss.edges[0].node)
  if (data?.allBroadcastss?.edges[1]) setNextBroadcast(data.allBroadcastss.edges[1].node);
  return (
    <Container>
      {isLive() && (
        <span className="now">Now <Dot /></span>
      )}
      {currentBroadcast ? (
        <>
          {currentBroadcast.hostedby._meta.uid} &mdash; {currentBroadcast.title}
        </>
      ) : (
        <>
          {rotationInfo ? (
            <>
              {getTimeRangeString(rotationInfo.data.current.begin, rotationInfo.data.current.end)}
              {rotationInfo.data.current.hostedby}&mdash;{rotationInfo.data.current.title}
            </>
          ) : (<>No station info available</>)}
        </>
      )}
    </Container>
  );
};

export default StreamShortInfo;
