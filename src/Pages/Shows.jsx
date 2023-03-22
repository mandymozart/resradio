import styled from "@emotion/styled";
import React from "react";
import Footer from "../Components/Footer";
import ShowList from "../Components/Shows/ShowList";

const Container = styled.section`
margin-top: 11rem;
  h2 {
    padding: 0 2rem;
  }
`

const Shows = () => {
  return (
    <Container>
      <h2>Shows</h2>
      <ShowList />
      <Footer />
    </Container>
  );
};

export default Shows;
