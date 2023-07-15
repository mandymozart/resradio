import styled from "@emotion/styled";
import dayjs from "dayjs";
import React from "react";
import { Link } from "react-router-dom";
import useAudioPlayerStore from "../../Stores/AudioPlayerStore";
import useBroadcastStore from "../../Stores/BroadcastStore";
import { BREAKPOINT_MD, BREAKPOINT_XS, DATE_FORMAT_LONG } from "../../config";
import PauseBig from "../../images/PauseBig";
import PlayBig from "../../images/PlayBig";
import { getTimeRangeString } from "../../utils";
import Tags from "../Tags";
import ThumbnailImage from "../TeaserImage/ThumbnailImage";
const Container = styled.div`
padding: 0 2rem 2rem 2rem;
display: grid;
grid-template-columns: 1fr 1fr 1fr 1fr;
@media (max-width: ${BREAKPOINT_MD}px) {
      grid-template-columns: 1fr 1fr;
    }
@media (max-width: ${BREAKPOINT_XS}px) {
      grid-template-columns: 1fr;
      padding: 0 1rem 1rem 1rem;
      gap: 1rem;
    }
gap: 2rem;
    box-sizing: border-box;
a {
  text-transform: initial;
}
h4 {
  text-transform: initial;
  margin: 0;
  @media (max-width: ${BREAKPOINT_XS}px) {
    font-size: 1.5rem;
  }
}
.date {
  font-size: 1rem;
  margin-top: 1rem;
  text-transform: uppercase;
}
.tags {
  margin-top: 2rem;
}
.image {
  overflow: hidden;
  position: relative;
  aspect-ratio: 1 / 1;
  width: 100%;
  max-height: 100%;
  svg {
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%,-50%);
    opacity: 0;
    transition: all .2s ease;
  }
  img {
    transition: all .2s ease;
    vertical-align: middle;
  }
  &:hover {
    cursor: pointer;
    img {
      filter: blur(10px);
      transform: scale(1.06);
    }
    svg {
      opacity: 1;
    }
  }
}
`
const ShowBroadcastsItem = ({ broadcast }) => {
  const { setPlaying, isPlaying, playing, setIsPlaying } = useBroadcastStore()
  const { setIsPlaying: setStreamIsPlaying } = useAudioPlayerStore()
  const play = (uid) => {
    setPlaying(uid)
    setStreamIsPlaying(false)
    setIsPlaying(true);
  }
  const pause = () => {
    setIsPlaying(false);

  }
  const handleClick = () => {
    if (broadcast.node.audio) {
      if (isPlaying && playing === broadcast.node._meta.uid) pause()
      else play(broadcast.node._meta.uid)
    }
  }
  return (
    <Container>
      <div className="image" onClick={() => handleClick()}>
        <ThumbnailImage image={broadcast.node.image.thumbnail} />
        {broadcast.node.audio ? (
          <>
            {isPlaying && playing === broadcast.node._meta.uid ? (
              <button>
                <PauseBig />
              </button>
            ) : (
              <button>
                <PlayBig />
              </button>
            )}
          </>
        ) : (<button disabled></button>)}
      </div>
      <div className="meta">
        <Link to={`../broadcasts/${broadcast.node._meta.uid}`}>
          <h4>
            {broadcast.node.title}
          </h4>
        </Link>
        <div className="date">
          {dayjs(broadcast.begin).format(DATE_FORMAT_LONG)}<br />
          {getTimeRangeString(broadcast.begin, broadcast.end)}
        </div>
        <div className="tags">
          <Tags tags={broadcast?.node._meta.tags} />
        </div>
      </div>

    </Container>
  );
};
export default ShowBroadcastsItem;
