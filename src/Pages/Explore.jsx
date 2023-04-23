import styled from "@emotion/styled";
import React from "react";
import FilterForm from "../Components/Filter/FilterForm";
import Footer from "../Components/Footer";
import HeaderOffset from "../Components/HeaderOffset";

const Container = styled.section`
h2 {
  padding: 2rem;
}
`

const Explore = () => {

  return (
    <HeaderOffset>
      <Container>
        <h2>Explore</h2>
        <FilterForm />
        <Footer />
      </Container>
    </HeaderOffset>
  );
};

export default Explore;
