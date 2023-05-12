import styled from "@emotion/styled";
import React from "react";
import HeaderOffset from "../Components/HeaderOffset";
import ShowList from "../Components/Shows/ShowList";

const Container = styled.div`
  h2 {
    margin: 0;
    padding: 1rem 2rem 0 2rem;
  }
`

const Shows = () => {
  return (
    <Container>

      <HeaderOffset>
        <h2>Shows</h2>
        <ShowList />
      </HeaderOffset>
    </Container>
  );
};

export default Shows;
