import styled from "@emotion/styled";
import React from "react";
import FilterForm from "../Components/Filter/FilterForm";
import FilterResults from "../Components/Filter/FilterResults";
import { LeadParagraph } from "../Components/Typography/LeadParagraph";
import { BREAKPOINT_XS } from "../config";

const Container = styled.section`
h2 {
  padding: 2rem 2rem 0 2rem;
  @media (max-width: ${BREAKPOINT_XS}px) {
    padding: 1rem 1rem 0 1rem;
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
}
`

const Explore = () => {
  return (
    <Container>
      <h2>Explore</h2>
      <LeadParagraph>
        Please select your filters to explore our broadcasts.
      </LeadParagraph>
      <FilterForm />
      <FilterResults />
    </Container>
  );
};

export default Explore;
