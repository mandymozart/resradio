import styled from "@emotion/styled";
import React from "react";

const Container = styled.div`
  min-height: calc(100vh - 3rem);
  display: block;
  margin-top: 3rem;
  padding: 1rem;
  a {
    text-decoration: underline;
  }
  div > h2 {
    text-align: center;
  }
  // Inner
  > div {
    /* padding: 1rem; */
    max-width: var(--content-width);
    margin: 0 auto;
    margin-top: 2rem;
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
