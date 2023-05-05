import styled from "@emotion/styled";
import React from "react";
import { Link } from "react-router-dom";
import ThumbnailImage from "../TeaserImage/ThumbnailImage";

const Container = styled.div`
padding: 2rem;
h4 {
  text-transform: initial;
  margin: 0;
  font-size: 1.25rem;
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

const ShowItem = ({ show }) => {
  return (
    <Container>
      <Link to={`${show.node._meta.uid} `}>
        <ThumbnailImage image={show.node.image.thumbnail} />
      </Link>
      <div className="meta">
        <Link to={`${show.node._meta.uid} `}>
          <h4>{show.node.title}</h4>
        </Link>
      </div>
    </Container>
  );
};
export default ShowItem;
