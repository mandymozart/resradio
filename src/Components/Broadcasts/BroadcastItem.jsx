import styled from "@emotion/styled";
import dayjs from "dayjs";
import React from "react";
import { Link } from "react-router-dom";
import useBroadcastStore from "../../Stores/BroadcastStore";
import PauseBig from "../../images/PauseBig";
import PlayBig from "../../images/PlayBig";
import { DATE_FORMAT } from "../../utils";
import ThumbnailImage from "../TeaserImage/ThumbnailImage";
const Container = styled.div`
padding: 0 2rem 2rem 2rem;
height: 100%;
    box-sizing: border-box;
a {
  text-transform: initial;
}
h4 {
  text-transform: initial;
  margin: 0;
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
  const play = (uid) => {
    setPlaying(uid)
    setIsPlaying(true);
  }
  const pause = () => {
    setIsPlaying(false);

  }
  return (
    <Container>
      <div className="image" onClick={() => play(broadcast.node._meta.uid)}>
        <ThumbnailImage image={broadcast.node.image.thumbnail} />
        {isPlaying && playing === broadcast.node._meta.uid ? (
          <button onClick={() => pause()}>
            <PauseBig />
          </button>
        ) : (
          <button onClick={() => play(broadcast.node._meta.uid)}>
            <PlayBig />
          </button>
        )}
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
      </div>

    </Container>
  );
};
export default BroadcastItem;
