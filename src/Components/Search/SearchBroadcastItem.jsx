import styled from "@emotion/styled";
import React from "react";
import { Link } from "react-router-dom";
import ThumbnailImage from "../TeaserImage/ThumbnailImage";

const Container = styled.div`
padding: 1rem 0;
height: 6rem;
border-bottom: 2px solid var(--color);
h4 {
  text-transform: initial;
  margin: 0;
  font-size: 1.25rem;
}
display: flex;
justify-content: space-between;
align-items: center;
.image {
  width:4rem;
  height:4rem;
}
`

const SearchBroadcastItem = ({ broadcast }) => {
  return (
    <Container>
      <div className="meta">
        <Link to={`/broadcasts/${broadcast._meta.uid} `}>
          <h4>{broadcast.title}</h4>
        </Link>
      </div>
      <div className="image">
        <ThumbnailImage image={broadcast.image.thumbnail} />
      </div>
    </Container>
  );
};
export default SearchBroadcastItem;
