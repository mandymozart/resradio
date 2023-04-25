import styled from "@emotion/styled";
import React from "react";
import { Link } from "react-router-dom";

const Container = styled.div`
padding: 2rem;
border-bottom: 2px solid var(--color);
h4 {
  text-transform: initial;
  margin: 0;
  font-size: 1.25rem;
}
`

const SearchBroadcastItem = ({ broadcast }) => {
  return (
    <Container>
      <div className="meta">
        <Link to={`${broadcast._meta.uid} `}>
          <h4>{broadcast.title}</h4>
        </Link>
        {broadcast.description}
      </div>
    </Container>
  );
};
export default SearchBroadcastItem;
