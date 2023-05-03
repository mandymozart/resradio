import { css } from "@emotion/react";
import styled from "@emotion/styled";
import React from "react";
import { SyncLoader } from "react-spinners";

const Container = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 0 2rem;
  justify-content: center;
`;

const override = css`
  display: block;
  margin: 0 auto;
  border-color: var(--color);
`;

const InlineLoader = ({ message }) => {
  return (
    <Container>
      <SyncLoader css={override} size={4} /> {message}
    </Container>
  );
};

export default InlineLoader;
