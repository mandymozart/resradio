import styled from "@emotion/styled";
import React from "react";

const Container = styled.div`
  min-height: calc(100vh - 3rem);
  display: block;
  margin-top: 7rem;
  padding: 1rem;

  // Inner
  > div {
    /* padding: 1rem; */
    max-width: var(--content-width);
    margin: 0 auto;
    margin-top: 2rem;
  }
  img {
    max-width: 100%;
  }
`;

const Layout = ({ children }) => {
  return (
    <Container>
      <div>{children}</div>
    </Container>
  );
};

export default Layout;
