import styled from "@emotion/styled";
import dayjs from "dayjs";
import React from "react";
import { Link } from "react-router-dom";
import ThumbnailPanoramaImage from "../TeaserImage/ThumbnailPanoramaImage";

const Container = styled.div`
box-sizing: border-box;
border-right: 2px solid var(--color);
border-bottom: 2px solid var(--color);
height: 100%;
box-sizing: border-box;
h4 {
  text-transform: initial;
  margin: 0;
  font-size: 1.25rem;
}
.meta {
  padding: 0 2rem 0 2rem;
  display: flex;
  justify-content: space-between;
  font-size: 1.25rem;
  padding-bottom: 3rem;
}
padding: 0 0rem;
  
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
