import styled from "@emotion/styled";
import dayjs from "dayjs";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useAudioPlayerStore from "../../Stores/AudioPlayerStore";
import useBroadcastStore from "../../Stores/BroadcastStore";
import { BREAKPOINT_MD, DATE_FORMAT_LONG } from "../../config";
import PauseBig from "../../images/PauseBig";
import PlayBig from "../../images/PlayBig";
import Tags from "../Tags";
import ThumbnailImage from "../TeaserImage/ThumbnailImage";
const Container = styled.div`
padding: 0 2rem 2rem 2rem;
@media (max-width: ${BREAKPOINT_MD}px) {
  padding: 0 1rem 1rem 1rem;
}
height: 100%;
box-sizing: border-box;
h4, .host {
  text-transform: initial;
  margin: 0;
  font-size: 1.5rem;
  font-family: var(--font-medium);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.host {
  margin-bottom: 0.25rem;
  margin-top: 2rem;
}
a {
  text-transform: initial;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
}
.title, .date {
  font-size: 1rem;
}
.date {
  text-transform: uppercase;
  margin-bottom: 2rem;
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
const BroadcastItem = ({ broadcast }) => {
  const { setPlaying, isPlaying, playing, setIsPlaying } = useBroadcastStore()
  const { setIsPlaying: setStreamIsPlaying } = useAudioPlayerStore()
  const navigate = useNavigate()
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
    } else {
      navigate(`../broadcasts/${broadcast.node._meta.uid}`)
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
        ) : (<button>Read More</button>)}

      </div>
      <div className="meta">
        <Link to={`../broadcasts/${broadcast.node._meta.uid}`} className="host">
          <h4>
            {broadcast.node.hostedby.title}
          </h4>
        </Link>
        <Link to={`../broadcasts/${broadcast.node._meta.uid}`} className="title">
          {broadcast.node.title}
        </Link>

        <div className="date">
          {dayjs(broadcast.node.begin).format(DATE_FORMAT_LONG)}
        </div>
        <Tags tags={broadcast.node._meta.tags} />
      </div>

    </Container>
  );
};
export default BroadcastItem;
