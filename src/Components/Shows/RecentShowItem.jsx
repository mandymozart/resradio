import styled from "@emotion/styled";
import dayjs from "dayjs";
import React from "react";
import { Link } from "react-router-dom";
import ThumbnailPanoramaImage from "../TeaserImage/ThumbnailPanoramaImage";

const Container = styled.div`
border-right: 2px solid var(--color);
border-bottom: 2px solid var(--color);
h4 {
  text-transform: initial;
  margin: 0;
  font-size: 1.25rem;
}
.meta {
  padding: 0 0rem 0 2rem;
  display: flex;
  justify-content: space-between;
}
&:nth-of-type(2n){
  border-right: none;
  padding-left: 1rem;
  .meta {
    padding: 0 2rem 0 0rem;
  }
  /* padding: 1rem 2rem 1rem 1rem; */
}
&:nth-of-type(2n + 1){
  border-left: none;
  padding-right: 1rem;
  /* padding: 1rem 1rem 1rem 2rem; */
}
  
`

const RecentShowItem = ({ show }) => {
  const linkTo = `shows/${show.node._meta.uid}`;
  return (
    <Container>
      <Link to={linkTo}>
        <ThumbnailPanoramaImage image={show.node.image.thumbnailPanorama} />
      </Link>
      <div className="meta">
        <Link to={linkTo}>
          <h4>{show.node.title}</h4>
        </Link>
        <div>{dayjs(show.node.begin).format("DD.MM.YYYY")}</div>
      </div>
    </Container>
  );
};
export default RecentShowItem;
