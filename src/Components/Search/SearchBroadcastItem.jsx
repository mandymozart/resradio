import styled from "@emotion/styled";
import React from "react";
import { Link } from "react-router-dom";
import { BREAKPOINT_XS } from "../../config";
import ThumbnailImage from "../TeaserImage/ThumbnailImage";

const Container = styled.div`
padding: 1rem 2rem;
border-top: 2px solid var(--color);
overflow: hidden;
@media (max-width: ${BREAKPOINT_XS}px) {
  padding: 1rem;
}
a {
  overflow: hidden;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
h4 {
  text-transform: initial;
  margin: 0;
  font-size: 1.5rem;
  font-family: var(--font-light);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  @media (max-width: ${BREAKPOINT_XS}px) {
    font-size: 1rem;
  }
  
}
display: flex;
justify-content: space-between;
align-items: center;
@media (max-width: ${BREAKPOINT_XS}px) {
  flex-direction: row-reverse;
  gap: 1rem;
  justify-content: flex-end;
}
.image {
  width:4rem;
  height:4rem;
    flex: 0 0 4rem;
}
`

const SearchBroadcastItem = ({ broadcast }) => {
  return (
    <Container>
      <div className="meta">
        <Link to={`/broadcasts/${broadcast._meta.uid} `}>
          <h4>{broadcast.hostedby?.title}&mdash;{broadcast.title}</h4>
        </Link>
      </div>
      <div className="image">
        <ThumbnailImage image={broadcast.image.thumbnail} />
      </div>
    </Container>
  );
};
export default SearchBroadcastItem;
