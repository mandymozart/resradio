import styled from "@emotion/styled";
import React from "react";

const Container = styled.footer`
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  background: var(--background);
`;

const Footer = () => {
  return (
    <Container>
      &copy; 2022 res.radio
      <br />
      <span>
        App made by{" "}
        <a
          href="https://www.viennastruggle.com"
          rel="noreferrer"
          target="_blank"
        >
          Vienna Struggle
        </a>
      </span>
    </Container>
  );
};

export default Footer;
