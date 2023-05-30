import styled from "@emotion/styled";
import React from "react";
import SearchDocumentsList from "../Components/Search/SearchDocumentsList";

const Container = styled.section`
h2 {
  padding: 3rem 2rem;
  margin: 0;
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
