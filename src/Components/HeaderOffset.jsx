import styled from "@emotion/styled";
import React from "react";

const Container = styled.div`
  margin-top: 8.9rem;
  // Inner
  img {
    max-width: 100%;
  }
`;

const HeaderOffset = ({ children }) => {
  return (
    <Container>
      {children}
    </Container>
  );
};

export default HeaderOffset;
