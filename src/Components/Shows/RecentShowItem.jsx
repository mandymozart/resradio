import styled from "@emotion/styled";
import React from "react";
import { Link } from "react-router-dom";
import ThumbnailPanoramaImage from "../TeaserImage/ThumbnailPanoramaImage";

const Container = styled.div`
border-right: 2px solid var(--color);
border-bottom: 2px solid var(--color);
h4 {
  text-transform: initial;
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
  return (
    <Container>
      <Link to={show.url}>
        <ThumbnailPanoramaImage image={show.data.image.thumbnailPanorama ? show.data.image.thumbnailPanorama : show.data.image} />
      </Link>
      <div className="meta">
        <Link key={show.id} to={show.url}>
          <h4>{show.data.title}</h4>
        </Link>
        <div>05.01.2023</div>
      </div>
    </Container>
  );
};
export default RecentShowItem;
