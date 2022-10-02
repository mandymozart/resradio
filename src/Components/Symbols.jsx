import styled from "@emotion/styled";
import React from "react";
import { Link } from "react-router-dom";
import FadeIn from "../Animations/FadeIn";
import Shapes from "../images/shapes/Shapes";

const Container = styled.section`
  width: 32rem;
  margin: 0 auto;
  padding-top: 5rem;
`;

const Symbols = ({ error }) => {
  return (
    <FadeIn>
      <Container>
        <h3>Symbols</h3>
        {[...Array(62)].map((e, i) => (
          <>
            <Shapes key={i} shape={i} />
            {i}
          </>
        ))}

        <p>
          <Link to="/">Return to homepage</Link>
        </p>
      </Container>
    </FadeIn>
  );
};

export default Symbols;
