import { css } from "@emotion/react";
import styled from "@emotion/styled";
import React from "react";
import { SyncLoader } from "react-spinners";

const Container = styled.div`
  height: 16rem;
  display: flex;
  align-items: center;
  padding: 2rem;
  justify-content: center;
`;

const override = css`
  display: block;
  margin: 0 auto;
  border-color: var(--color);
`;

const SectionLoader = ({ message }) => {
  return (
    <Container>
      <SyncLoader css={override} size={12} /> {message}
    </Container>
  );
};

export default SectionLoader;
