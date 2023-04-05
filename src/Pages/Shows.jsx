import styled from "@emotion/styled";
import React from "react";
import Footer from "../Components/Footer";
import HeaderOffset from "../Components/HeaderOffset";
import ShowList from "../Components/Shows/ShowList";

const Container = styled.div`
  h2 {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    margin: 0;
    span {
      border-right: 2px solid var(--color);
      padding: 1rem 2rem;
      &:last-of-type {
        border: none;
      }
    }
  }
`

const Shows = () => {
  return (
    <Container>

      <HeaderOffset>
        <h2><span>Shows</span><span></span><span></span><span></span></h2>
        <ShowList />
        <Footer />
      </HeaderOffset>
    </Container>
  );
};

export default Shows;
