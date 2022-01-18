import styled from "@emotion/styled";
import React from "react";

const Container = styled.footer`
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
`;

const Footer = () => {
  return (
    <Container>
      &copy; 2022 res.radio
      <br />
      Made by{" "}
      <a href="https://www.viennastruggle.com" rel="noreferrer" target="_blank">
        Vienna Struggle
      </a>
    </Container>
  );
};

export default Footer;
