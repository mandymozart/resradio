import styled from "@emotion/styled";
import React from "react";
import SearchDocumentsList from "../Components/Search/SearchDocumentsList";

const Container = styled.section`
`

const SearchResults = () => {

  return (
    <Container>
      <SearchDocumentsList />
    </Container>
  );
};

export default SearchResults;
