import styled from "@emotion/styled";
import dayjs from "dayjs";
import React from "react";
import { Link } from "react-router-dom";
import PlayBig from "../../images/PlayBig";
import ThumbnailImage from "../TeaserImage/ThumbnailImage";
const Container = styled.div`
padding: 0 2rem 2rem 2rem;
display: grid;
grid-template-columns: 1fr 1fr 1fr 1fr;
gap: 2rem;
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
const ShowBroadcastItem = ({ broadcast }) => {

  return (
    <Container>
      <div className="image">
        <ThumbnailImage image={broadcast.node.image.thumbnail} />
        <PlayBig />
      </div>
      <div className="meta">
        <Link to={`../broadcasts/${broadcast.node._meta.uid}`}>
          <h4>
            {broadcast.node.title}
          </h4>
        </Link>
        <div className="date">
          <span>
            {dayjs(broadcast.node.begin).format("ddd")}
          </span>{" "}
          {dayjs(broadcast.node.begin).format("DD.MM.YYYY")}
        </div>
      </div>

    </Container>
  );
};
export default ShowBroadcastItem;