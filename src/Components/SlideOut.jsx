import { useChannel } from "@ably-labs/react-hooks";
import { useLazyQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { useClickAway } from "@uidotdev/usehooks";
import clsx from "clsx";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import utc from "dayjs/plugin/utc";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
a {
      cursor: pointer;
    }
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
    display: grid;
    gap: 0;
    line-height: 3rem;
    justify-content: space-between;
    grid-template-columns: 8.5rem auto 1fr;
    border-bottom: 2px solid var(--color);

    div:first-of-type {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .next {
      font-family: var(--font-medium);
      background-color: var(--second);
      border-right: 2px solid var(--color);
      @media (max-width: ${BREAKPOINT_MD}px) {
        display: none;
        border:0;
        background-color: var(--background);
        color: var(--color);
      }
      color: var(--background);
      padding: 0 2rem 0 2rem;
    }
    .status {
      padding-left: 2rem ;
    }
    .schedule {
      text-align: center;
    }
    a {
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
  const ref = useClickAway(() => {
    setIsExpanded(false);
  });
  // ably websocket
  const [broadcast, setBroadcast] = useState()
  const [nextBroadcastPreview, setNextBroadcastPreview] = useState()
  const [uid, setUid] = useState();
  useChannel(config.ABLY_ROTATION_CHANNEL, (message) => {
    setUid(message.data.current.uid)
    setNextBroadcastPreview(message.data.next)
  });
  const { history, currentBroadcast, nextBroadcast } = useBroadcastStore();
  const [getData, { loading, error, data }] = useLazyQuery(getBroadcastQuery,
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
  }, [uid])

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
            <a onClick={() => goToLink("../shows/" + broadcast.hostedby._meta.uid)}>
              <h3 className="show-title">{broadcast.hostedby.title}</h3>
              <div className="title">{broadcast.title}</div>
            </a>
            <p className="description">
              {broadcast.description?.substring(1, 120)} ...
            </p>
            <a onClick={() => goToLink("../shows/" + broadcast.hostedby._meta.uid)} className="more">
              read more
            </a>
          </div>

        </>)}

      </div>
      <footer>
        <span className="next">NEXT</span>
        <div className="status">
          {nextBroadcastPreview && (
            <>
              {loading ? <InlineLoader /> : (<>
                {nextBroadcastPreview?.hostedby}&mdash;{nextBroadcastPreview?.title}
              </>)}
            </>
          )}
        </div>
        <a onClick={() => goToLink("/schedule")} className="schedule"><span className="show-more-prefix">Show </span>Schedule</a>
      </footer>
    </div>
  </Container>
  )
}

export default SlideOut;