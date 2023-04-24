import styled from "@emotion/styled";
import React from "react";
import HeaderOffset from "../Components/HeaderOffset";
import SearchShowList from "../Components/Shows/SearchShowList";

const Container = styled.section`
h2 {
  padding: 2rem;
}
`

const SearchResults = () => {

  return (
    <HeaderOffset>
      <Container>
        <h2>Search</h2>
        <SearchShowList />
      </Container>
    </HeaderOffset>
  );
};

export default SearchResults;
