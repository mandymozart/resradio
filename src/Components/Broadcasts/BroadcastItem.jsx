import styled from "@emotion/styled";
import { PrismicLink } from "@prismicio/react";
import dayjs from "dayjs";
import React from "react";
import ThumbnailImage from "../TeaserImage/ThumbnailImage";
const Container = styled.div`
padding: 2rem;
border-right: 2px solid var(--color);
border-bottom: 2px solid var(--color);
h4 {
  text-transform: initial;
}
&:nth-of-type(4n){
  border-right: none;
  /* padding: 1rem 2rem 1rem 1rem; */
}
&:nth-of-type(4n + 1){
  border-left: none;
  /* padding: 1rem 1rem 1rem 2rem; */
}
`
const BroadcastItem = ({ broadcast }) => {

  return (
    <Container>
      <ThumbnailImage image={broadcast.data.image.thumbnail ? broadcast.data.image.thumbnail : broadcast.data.image} />
      <div className="meta">
        <PrismicLink field={broadcast}>
          <h4>{broadcast.data.title}</h4>
        </PrismicLink>

        <PrismicLink field={broadcast.data.hostedby}>
          {broadcast.data.hostedby.title}
        </PrismicLink>

        <p>
          {dayjs(broadcast.data.begin).format("ddd, MMM D, YYYY HH:mm")}{" "}
        </p>
      </div>

    </Container>
  );
};
export default BroadcastItem;
