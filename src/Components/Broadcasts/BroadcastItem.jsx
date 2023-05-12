import styled from "@emotion/styled";
import dayjs from "dayjs";
import React from "react";
import { Link } from "react-router-dom";
import useAudioPlayerStore from "../../Stores/AudioPlayerStore";
import useBroadcastStore from "../../Stores/BroadcastStore";
import { BREAKPOINT_MD } from "../../config";
import PauseBig from "../../images/PauseBig";
import PlayBig from "../../images/PlayBig";
import Scheduled from "../../images/Schedule";
import { DATE_FORMAT } from "../../utils";
import Tags from "../Tags";
import ThumbnailImage from "../TeaserImage/ThumbnailImage";
const Container = styled.div`
padding: 0 2rem 2rem 2rem;
@media (max-width: ${BREAKPOINT_MD}px) {
  padding: 0 1rem 1rem 1rem;
}
height: 100%;
box-sizing: border-box;
a {
  text-transform: initial;
}
h4 {
  text-transform: initial;
  font-size: 1.25rem;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.meta {
  font-size: 1.25rem;
  a {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
  }
}
.date {
  span {
    text-transform: uppercase;
  }
}
.image {
  overflow: hidden;
  position: relative;
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
const BroadcastItem = ({ broadcast }) => {
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
        ) : (<button disabled><Scheduled /></button>)}

      </div>
      <div className="meta">
        <Link to={`../broadcasts/${broadcast.node._meta.uid}`}>
          <h4>
            {broadcast.node.hostedby.title}
          </h4>
          {broadcast.node.title}
        </Link>
        <div className="date">
          <span>
            {dayjs(broadcast.node.begin).format("ddd")}
          </span>{" "}
          {dayjs(broadcast.node.begin).format(DATE_FORMAT)}
        </div>
        <Tags tags={broadcast.node._meta.tags} />
      </div>

    </Container>
  );
};
export default BroadcastItem;
