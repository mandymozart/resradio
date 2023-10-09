import { useChannel } from "@ably-labs/react-hooks";
import { useLazyQuery } from "@apollo/client";
import styled from "@emotion/styled";
import clsx from "clsx";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import utc from "dayjs/plugin/utc";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useDebounce from "../Hooks/useDebounce.";
import { getBroadcastQuery } from "../Queries/broadcasts";
import useBroadcastStore from "../Stores/BroadcastStore";
import useChatStore from "../Stores/ChatStore";
import { ABLY_ROTATION_CHANNEL, BREAKPOINT_L, BREAKPOINT_MD, BREAKPOINT_XS, DATE_FORMAT } from '../config';
import { getTimeRangeString } from "../utils";
import InlineLoader from "./InlineLoader";
import ThumbnailPanoramaImage from "./TeaserImage/ThumbnailPanoramaImage";
dayjs.extend(isBetween);
dayjs.extend(utc);

const Container = styled.menu`
margin: 0;
padding: 0;
font-size: 1.5rem;
.date {
  margin-bottom: 1rem;
  font-size: 1rem;
}
h3 {
  margin: 0;
  font-size: 1.5rem;
  font-family: var(--font-medium);
  text-transform: initial;
  @media (max-width: ${BREAKPOINT_XS}px) {
    font-size: 1rem;
  }
}
p {
  margin: 0;
  font-family: var(--font-light);
  padding-right: 2rem;
}
.title {
  text-transform: initial;
  margin-bottom: 1rem;
  font-size: 1.5rem;
  font-family: var(--font-medium);
  @media (max-width: ${BREAKPOINT_MD}px) {
    margin-bottom: 1rem;
  }
  @media (max-width: ${BREAKPOINT_XS}px) {
    font-size: 1rem;
  }
}
.description {
  font-family: var(--font-light);
  font-size: 1.5rem;
  margin-bottom: 1rem;
  @media (max-width: ${BREAKPOINT_MD}px) {
      display: none;
    }
}
.more {
  font-size: 1rem;
  text-transform: uppercase;
  margin-bottom: 0;
  display: block;
}
img {
  width: 100%;
}
> div {
  z-index: 1;
  position: absolute;
  top: calc(10.5rem + 2px);
  width: 100%;
  background: var(--background);
  transform: translateY(calc(-40rem - 2px));
  border-bottom: 2px solid var(--color);
  opacity: 0;

  &.isExpanded {
    opacity: 1;
    transform: translateY(0);
    /* .top {
      padding: 0;
    } */
  }
  &.isChatVisible {
    width: calc(100% - 23rem);
  }

  .top {
    display: grid;
    grid-template-columns: 2fr 2fr;
    @media (max-width: ${BREAKPOINT_L}px) {
      grid-template-columns: 2fr 2fr;
    }
    @media (max-width: ${BREAKPOINT_MD}px) {
      grid-template-columns: 2fr;
      padding: 0;
      gap: 1.5rem;
    }
    @media (max-width: ${BREAKPOINT_XS}px) {
      gap: 1rem;
    }
    gap: 1rem;
    padding: 2rem 0;
    .info {
      @media (max-width: ${BREAKPOINT_MD}px) {
        padding: 0 2rem 1rem 2rem;
      }
      @media (max-width: ${BREAKPOINT_XS}px) {
        padding: 0 1rem 1rem 1rem;
      }
    }
  }
}
`
const SlideOut = ({ isExpanded, setIsExpanded }) => {
  const navigate = useNavigate();

  const { isVisible: isChatVisible } = useChatStore();
  const [broadcast, setBroadcast] = useState();
  const [nextBroadcastPreview, setNextBroadcastPreview] = useState();
  const [uid, setUid] = useState();
  // wire up ably websocket
  useChannel(`[?rewind=1]${ABLY_ROTATION_CHANNEL}`, (message) => {
    setUid(message.data.current.uid)
    console.log("Rotation update received", message.data)
    setNextBroadcastPreview(message.data.next)
  });
  const { currentBroadcast, nextBroadcast } = useBroadcastStore();
  // get full data from Prismic for broadcast
  const [getData, { loading, data }] = useLazyQuery(getBroadcastQuery,
    {
      variables: {
        uid: uid
      }
    })

  const debouncedRequest = useDebounce(() => {
    if (uid) {
      getData()
    }
  });
  useEffect(() => {
    console.log(uid)
    debouncedRequest()
  }, [uid, getData, debouncedRequest])

  useEffect(() => {
    console.log("Prismic data received", data)
    if (data?.broadcasts)
      setBroadcast(data.broadcasts)
  }, [data])

  useEffect(() => {
    setBroadcast(currentBroadcast)
    if (nextBroadcast)
      setNextBroadcastPreview({
        ...nextBroadcast,
        hostedby: nextBroadcast.hostedby.title
      })
  }, [currentBroadcast, nextBroadcast])

  const goToLink = (to) => {
    navigate(to)
    setIsExpanded(false)
  }
  return (<Container>
    <div className={clsx({ isExpanded: isExpanded, isChatVisible: isChatVisible })}>
      <div className="top">
        {loading && <InlineLoader />}
        {broadcast && (<>
          <div className="image">
            <ThumbnailPanoramaImage image={broadcast.image.hero} />
          </div>
          <div className="info">
            <div className="date">
              {dayjs(broadcast.begin).format("ddd")} {dayjs(broadcast.begin).format(DATE_FORMAT)}<br />
              {getTimeRangeString(broadcast.begin, broadcast.end)}
            </div>
            <button onClick={() => goToLink("../shows/" + broadcast.hostedby._meta.uid)}>
              <h3 className="show-title">{broadcast.hostedby.title}</h3>
              <div className="title">{broadcast.title}</div>
            </button>
            <p className="description">
              {broadcast.description?.substring(0, 120)} ...
            </p>
            <button onClick={() => goToLink("../broadcasts/" + broadcast._meta.uid)} className="more">
              read more
            </button>
            {nextBroadcastPreview && (
              <button onClick={() => goToLink("../broadcasts/" + nextBroadcastPreview.uid)} className="more">
                {loading ? <InlineLoader /> : (<>
                  NEXT: {nextBroadcastPreview?.hostedby}&mdash;{nextBroadcastPreview?.title}
                </>)}
              </button>
            )}
          </div>

        </>)}

      </div>
    </div>
  </Container>
  )
}

export default SlideOut;