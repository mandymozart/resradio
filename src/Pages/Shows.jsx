import styled from "@emotion/styled";
import React from "react";
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
      <h2>Shows</h2>
      <ShowList />
    </Container>
  );
};

export default Shows;
