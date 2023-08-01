import { useChannel } from "@ably-labs/react-hooks";
import { useLazyQuery } from "@apollo/client";
import styled from "@emotion/styled";
import clsx from "clsx";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import utc from "dayjs/plugin/utc";
import React, { useEffect, useRef, useState } from "react";
import { GoIterations } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import { useOnClickOutside } from 'usehooks-ts';
import useDebounce from "../Hooks/useDebounce.";
import { getBroadcastQuery } from "../Queries/broadcasts";
import useBroadcastStore from "../Stores/BroadcastStore";
import config, { BREAKPOINT_L, BREAKPOINT_MD, BREAKPOINT_XS, DATE_FORMAT } from '../config';
import { getTimeRangeString } from "../utils";
import InlineLoader from "./InlineLoader";
import ThumbnailPanoramaImage from "./TeaserImage/ThumbnailPanoramaImage";
dayjs.extend(isBetween);
dayjs.extend(utc);

const Container = styled.menu`
margin: 0;
padding: 0;
border-bottom: 2px solid var(--color);
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
  margin-bottom: .5rem;
  display: block;
}
img {
  width: 100%;
}
> div {
  z-index: 1;
  position: fixed;
  top: 10.5rem;
  width: 100%;
  background: var(--background);
  transform: translateY(-40rem);
  transition: transform .2s ease-out;

  &.isExpanded {
    opacity: 1;
    transform: translateY(0);
    /* .top {
      padding: 0;
    } */
  }

  .top {
    border-bottom: 2px solid var(--color);
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
  footer {
    display: flex;
    gap: 1rem;
    padding: 0 2rem;
    @media (max-width: ${BREAKPOINT_XS}px) {
      padding: 0 1rem;
    }
    line-height: 3rem;
    justify-content: space-between;
    border-bottom: 2px solid var(--color);

    div:first-of-type {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .next {
      padding: 0 0 0 1.75rem;
    }
    .status {
      flex: 1;
    }
    .schedule {
      text-align: center;
      text-transform: uppercase;
      line-height: 3rem;
    }
    button {
      font-size: 1.25rem;
    }
    .show-more-prefix {
      white-space: nowrap;
      @media (max-width: ${BREAKPOINT_MD}px) {
        display: none;
      }
    }
  }
}
`
const SlideOut = ({ isExpanded, setIsExpanded }) => {
  const navigate = useNavigate()
  const ref = useRef(null);

  const handleClickOutside = () => {
    // Your custom logic here
    console.log("clicked outside", isExpanded)
    if (isExpanded)
      setIsExpanded(false);
  }

  const handleClickInside = () => {
    // Your custom logic here
    console.log('clicked inside')
  }

  useOnClickOutside(ref, handleClickOutside)

  // ably websocket
  const [broadcast, setBroadcast] = useState()
  const [nextBroadcastPreview, setNextBroadcastPreview] = useState()
  const [uid, setUid] = useState();
  useChannel(config.ABLY_ROTATION_CHANNEL, (message) => {
    setUid(message.data.current.uid)
    setNextBroadcastPreview(message.data.next)
  });
  const { history, currentBroadcast, nextBroadcast } = useBroadcastStore();
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
    debouncedRequest()
  }, [uid, getData, debouncedRequest])

  useEffect(() => {
    if (data?.broadcasts)
      setBroadcast(data.broadcasts)
  }, [data])

  useEffect(() => {
    setBroadcast(currentBroadcast)
  }, [currentBroadcast, nextBroadcast])


  useEffect(() => {
    setUid(history?.prismicId);
  }, [history])

  const goToLink = (to) => {
    navigate(to)
    setIsExpanded(false)
  }
  return (<Container>
    <div className={clsx({ isExpanded: isExpanded })} ref={ref}>
      <div className="top">
        {loading && <InlineLoader />}
        {currentBroadcast && <>current Broadcast {JSON.stringify(currentBroadcast)}</>}
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
            <button onClick={() => goToLink("../shows/" + broadcast.hostedby._meta.uid)} className="more">
              read more
            </button>
          </div>

        </>)}

      </div>
      <footer>
        <span className="next"><GoIterations /></span>
        <div className="status">
          {nextBroadcastPreview && (
            <>
              {loading ? <InlineLoader /> : (<>
                {nextBroadcastPreview?.hostedby}&mdash;{nextBroadcastPreview?.title}
              </>)}
            </>
          )}
        </div>
        <button onClick={() => goToLink("/schedule")} className="schedule"><span className="show-more-prefix">Show </span>Schedule</button>
      </footer>
    </div>
  </Container>
  )
}

export default SlideOut;