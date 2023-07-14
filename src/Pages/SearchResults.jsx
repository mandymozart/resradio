import styled from "@emotion/styled";
import React from "react";
import SearchDocumentsList from "../Components/Search/SearchDocumentsList";
import { BREAKPOINT_XS } from "../config";

const Container = styled.section`
h2 {
  padding: 3rem 2rem;
  margin: 0;
  @media (max-width: ${BREAKPOINT_XS}px) {
    padding: 1rem 1rem;
    font-size: 1.5rem;
  }
}
`

const SearchResults = () => {

  return (
    <Container>
      <h2>Results</h2>
      <SearchDocumentsList />
    </Container>
  );
};

export default SearchResults;
