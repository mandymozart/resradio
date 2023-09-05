import { useChannel, usePresence } from "@ably-labs/react-hooks";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import utc from "dayjs/plugin/utc";
import React, { useEffect } from "react";
import { getBroadcastsQuery } from "../../Queries/broadcasts";
import useBroadcastStore from "../../Stores/BroadcastStore";
import { ABLY_ROTATION_CHANNEL, FUNCTIONS } from "../../config";
dayjs.extend(isBetween);
dayjs.extend(utc);

const Container = styled.div`
white-space: nowrap;
overflow: hidden;
text-overflow: ellipsis;
flex: 1;
padding-left: 1rem;
justify-content: center;
align-items: center;
`;

const StreamShortInfo = ({ onClick }) => {
  const { history, setHistory, currentBroadcast, setCurrentBroadcast, setNextBroadcast, setRotationInfo, rotationInfo } = useBroadcastStore();

  const after = dayjs();
  const before = dayjs();

  const { error, data } = useQuery(
    getBroadcastsQuery,
    {
      variables:
      {
        endAfter: after.format(),
        sortBy: "begin_ASC"
      },
      pollInterval: 6 * 1000
    });

  useEffect(() => {
    if (data) {
      data?.allBroadcastss.edges.forEach((item) => {
        if (dayjs(item.node.begin).isBefore(before)) {
          setCurrentBroadcast(item.node)
          if (data.allBroadcastss.edges[1]?.node)
            setNextBroadcast(data.allBroadcastss.edges[1].node)
          return
        }
      })
    }
  }, [data, setCurrentBroadcast, setNextBroadcast])



  const getBroadcastHistory = async () => {
    if (dayjs(rotationInfo?.data?.current.end).isAfter(after) && dayjs(rotationInfo?.data?.current.begin).isBefore(before)) {

    } else {
      // Get info from History
      const res = await fetch(`${FUNCTIONS}/broadcasts?from=0&to=24`)
      const history = await res.json()
      const historyCurrent = history.filter(broadcast => dayjs(broadcast.end).isAfter(after) && dayjs(broadcast.begin).isBefore(before))[0]
      setHistory(historyCurrent)
    }
  }

  useEffect(() => {
    getBroadcastHistory()
  }, [rotationInfo])

  // ably websocket
  useChannel(ABLY_ROTATION_CHANNEL, (message) => {
    console.log(message)
    setRotationInfo(message)
  });
  usePresence(ABLY_ROTATION_CHANNEL, "listener");

  if (error) return <>Error : {error.message}</>;
  return (
    <Container>
      {currentBroadcast ? (
        <>
          {currentBroadcast.hostedby?.title}&mdash;{currentBroadcast.title}
        </>
      ) : (
        <>
          {rotationInfo ? (
            <>
              {rotationInfo.data.current.hostedby}&mdash;{rotationInfo.data.current.title}
            </>
          ) : (<>{history?.hostedBy}&mdash;{history?.title}</>)}
        </>
      )}
    </Container>
  );
};

export default StreamShortInfo;
