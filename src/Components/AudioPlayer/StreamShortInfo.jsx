import { useChannel, usePresence } from "@ably-labs/react-hooks";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import utc from "dayjs/plugin/utc";
import React, { useEffect } from "react";
import { getBroadcastsQuery } from "../../Queries/broadcasts";
import useBroadcastStore from "../../Stores/BroadcastStore";
import config, { FUNCTIONS } from "../../config";
dayjs.extend(isBetween);
dayjs.extend(utc);

const Container = styled.div`

white-space: nowrap;
overflow: hidden;
text-overflow: ellipsis;
 flex: 1;
 justify-content: center;
 align-items: center;
`;

const StreamShortInfo = () => {
  const after = dayjs();
  const before = dayjs()
  const { error, data } = useQuery(
    getBroadcastsQuery,
    {
      variables:
      {
        endAfter: after.format(),
        beginBefore: before.format(),
      },
      pollInterval: 60 * 1000
    });
  const { history, setHistory, currentBroadcast, setCurrentBroadcast, setNextBroadcast, setRotationInfo, rotationInfo } = useBroadcastStore();

  const getBroadcastHistory = async () => {
    if (dayjs(rotationInfo?.data?.current.end).isAfter(after) && dayjs(rotationInfo?.data?.current.begin).isBefore(before)) {
    } else {
      // Get info from History
      const res = await fetch(`${FUNCTIONS}/broadcasts?from=0&to=24`)
      const history = await res.json()
      const historyCurrent = history.filter(broadcast => dayjs(broadcast.end).isAfter(after) && dayjs(broadcast.begin).isBefore(before))[0]
      console.log(historyCurrent, rotationInfo?.data?.current.uid);
      setHistory(historyCurrent)
    }
  }

  useEffect(() => {
    getBroadcastHistory()
  }, [rotationInfo])

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
      {currentBroadcast ? (
        <>
          {currentBroadcast.hostedby?._meta.uid}&mdash;{currentBroadcast.title}
        </>
      ) : (
        <>
          {rotationInfo ? (
            <>
              {rotationInfo.data.current.hostedby}&mdash;{rotationInfo.data.current.title}
            </>
          ) : (<>{history?.title}</>)}
        </>
      )}
    </Container>
  );
};

export default StreamShortInfo;
