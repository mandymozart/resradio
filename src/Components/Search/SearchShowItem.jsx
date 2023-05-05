import styled from "@emotion/styled";
import React from "react";
import { Link } from "react-router-dom";

const Container = styled.div`
padding: 1rem 0;
border-bottom: 2px solid var(--color);
h4 {
  text-transform: initial;
  margin: 0;
  font-family: var(--font-light);
  font-size: 1.25rem;
}
  
`

const SearchShowItem = ({ show }) => {
  return (
    <Container>
      <div className="meta">
        <Link to={`/shows/${show._meta.uid} `}>
          <h4>{show.title}</h4>
        </Link>
      </div>
    </Container>
  );
};
export default SearchShowItem;
