import styled from "@emotion/styled";
import React from "react";
import SectionLoader from "./SectionLoader";

const Container = styled.div`
  height: calc(100vh - 7rem);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PageLoader = () => {
  return (
    <Container>
      <SectionLoader />
    </Container>
  );
};

export default PageLoader;
