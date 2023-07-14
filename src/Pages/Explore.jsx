import styled from "@emotion/styled";
import React from "react";
import FilterForm from "../Components/Filter/FilterForm";
import FilterResults from "../Components/Filter/FilterResults";
import { BREAKPOINT_MD, BREAKPOINT_XS } from "../config";

const Container = styled.section`
h2 {
  padding: 2rem 2rem 0 2rem;
  @media (max-width: ${BREAKPOINT_MD}px) {
    padding: 1rem 1rem 0 1rem;
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
}
p.lead {
  width: 50%;
  padding: 0 2rem;
  font-size: 1.5rem;
  @media (max-width: ${BREAKPOINT_MD}px) {
    width: auto;
  }
  @media (max-width: ${BREAKPOINT_XS}px) {
    font-size: 1rem;
    padding: 0 1rem;
    margin-bottom: 1rem;
  }
}
`

const Explore = () => {
  return (
    <Container>
      <h2>Explore</h2>
      <p className="lead">
        Please select your filters to explore our broadcasts.
      </p>
      <FilterForm />
      <FilterResults />
    </Container>
  );
};

export default Explore;
