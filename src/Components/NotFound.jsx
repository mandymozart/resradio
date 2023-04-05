import styled from "@emotion/styled";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import FadeIn from "../Animations/FadeIn";
import useThemeStore from "../Stores/ThemeStore";
import icon from "./../images/cat.png";

const Container = styled.section`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  height: 100vh;
  text-align: center;
`;

const NotFound = ({ error }) => {
  const setKeyword = useThemeStore((store) => store.setKeyword);
  useEffect(() => {
    if (document) setKeyword("fuckoff");
  }, [setKeyword]);
  return (
    <FadeIn>
      <Container>
        <h3>
          404
          <br />
          Document not found
        </h3>
        <img src={icon} alt="Not found" />
        <p>{JSON.stringify(error)}</p>
        <p>
          <Link to="/">Return to homepage</Link>
        </p>
      </Container>
    </FadeIn>
  );
};

export default NotFound;
