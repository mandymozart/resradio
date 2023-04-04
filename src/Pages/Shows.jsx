import styled from "@emotion/styled";
import React from "react";
import Footer from "../Components/Footer";
import HeaderOffset from "../Components/HeaderOffset";
import ShowList from "../Components/Shows/ShowList";

const Container = styled.div`
  h2 {
    padding: 2rem 2rem 1rem 2rem;
    margin: 0;
  }
`

const Shows = () => {
  return (
    <Container>

      <HeaderOffset>
        <h2>Shows</h2>
        <ShowList />
        <Footer />
      </HeaderOffset>
    </Container>
  );
};

export default Shows;
