import styled from "@emotion/styled";
import React from "react";
import HeaderOffset from "../Components/HeaderOffset";
import SearchDocumentsList from "../Components/Search/SearchDocumentsList";

const Container = styled.section`
width: 50vw;
margin: 0 auto;
h2 {
  padding: 2rem 0;
}
`

const SearchResults = () => {

  return (
    <HeaderOffset>
      <Container>
        <h2>Search</h2>
        <SearchDocumentsList />
      </Container>
    </HeaderOffset>
  );
};

export default SearchResults;
