import styled from "@emotion/styled";
import dayjs from "dayjs";
import React from "react";
import { Link } from "react-router-dom";
import ThumbnailImage from "../TeaserImage/ThumbnailImage";
const Container = styled.div`
padding: 2rem;
border-right: 2px solid var(--color);
border-bottom: 2px solid var(--color);
height: 100%;
    box-sizing: border-box;
a {
  text-transform: initial;
}
h4 {
  text-transform: initial;
  margin: 0;
}
&:nth-of-type(4n){
  border-right: none;
  /* padding: 1rem 2rem 1rem 1rem; */
}
&:nth-of-type(4n + 1){
  border-left: none;
  /* padding: 1rem 1rem 1rem 2rem; */
}
.date {
  span {
    text-transform: uppercase;
  }
}
`
const BroadcastItem = ({ broadcast }) => {

  return (
    <Container>
      <ThumbnailImage image={broadcast.node.image.thumbnail} />
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
          {dayjs(broadcast.node.begin).format("DD.MM.YYYY")}
        </div>
      </div>

    </Container>
  );
};
export default BroadcastItem;
