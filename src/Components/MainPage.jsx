import styled from "@emotion/styled";
import clsx from "clsx";
import React from "react";
import useChatStore from "../Stores/ChatStore";

const Container = styled.div`
  margin-top: 10.5rem;
  &.isChatVisible {
    width: calc(100% - 23rem);
  }
  // Inner
  img {
    max-width: 100%;
  }
`;

const MainPage = ({ children }) => {
  const { isVisible: isChatVisible } = useChatStore();
  return (
    <Container className={clsx({ isChatVisible: isChatVisible })}>
      {children}
    </Container>
  );
};

export default MainPage;
