import styled from "@emotion/styled";
import React, { useEffect } from "react";
import FilterForm from "../Components/Filter/FilterForm";
import FilterResults from "../Components/Filter/FilterResults";
import HeaderOffset from "../Components/HeaderOffset";
import useFilterStore from "../Stores/FilterStore";
import { BREAKPOINT_MD } from "../config";

const Container = styled.section`
h2 {
  padding: 2rem 2rem 0 2rem;
}
p.lead {
  width: 50%;
  @media (max-width: ${BREAKPOINT_MD}px) {
      width: auto;
  }
  padding: 0 2rem;
  font-size: 1.5rem;
}
`

const Explore = () => {
  const { genres, moods, tempos } = useFilterStore();

  useEffect(() => {

  }, [genres, moods, tempos])
  return (
    <HeaderOffset>
      <Container>
        <h2>Explore</h2>
        <p className="lead">
          Please select your filters to explore our broadcasts.
        </p>
        <FilterForm />
        <FilterResults />
      </Container>
    </HeaderOffset>
  );
};

export default Explore;
