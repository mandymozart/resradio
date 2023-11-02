import { useChannel, usePresence } from "@ably-labs/react-hooks";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import utc from "dayjs/plugin/utc";
import React, { useEffect, useState } from "react";
import { getBroadcastsQuery } from "../../Queries/broadcasts";
import useBroadcastStore from "../../Stores/BroadcastStore";
import { ABLY_ROTATION_CHANNEL } from "../../config";
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
div {
  cursor: pointer;
}
`;

const StreamShortInfo = ({ onClick }) => {
  const { currentBroadcast, setCurrentBroadcast, setNextBroadcast, setRotationInfo, rotationInfo } = useBroadcastStore();
  const [initial, setInitial] = useState(true);

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
      pollInterval: 10 * 1000
    });

  useEffect(() => {
    if (data) {
      data?.allBroadcastss.edges.forEach((item) => {
        if (dayjs(item.node.begin).isBefore(before)) {
          setCurrentBroadcast(item.node)
          if (data.allBroadcastss.edges[1]?.node) {
            setNextBroadcast(data.allBroadcastss.edges[1].node)
          }
          return
        }
      })
      setInitial(false)
    }
  }, [data, setCurrentBroadcast, setNextBroadcast])

  // ably websocket
  useChannel(`[?rewind=1]${ABLY_ROTATION_CHANNEL}`, (message) => {
    setRotationInfo(message)
  });
  usePresence(ABLY_ROTATION_CHANNEL, "listener");

  if (error) return <>Error : {error.message}</>;
  if (initial) return (<Container>Loading ...</Container>)
  return (
    <Container >
      <div onClick={() => onClick()}>
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
            ) : (<></>)}
          </>
        )}
      </div>
    </Container>
  );
};

export default StreamShortInfo;
