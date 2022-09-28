import styled from "@emotion/styled";
import React from "react";
import { Link } from "react-router-dom";
import Grid from "../images/Grid";
import Logo from "../images/Logo";
import Button from "./Button";
import Social from "./Social/Social";

const Container = styled.footer`
  padding: 1rem;
  max-width: var(--content-width);
  margin: 0 auto;
  text-align: center;
  > div svg {
    margin: 0.5rem auto;
    width: 8rem;
  }
`;

const Footer = () => {
  return (
    <Container>
      <h3>WANT TO JOIN?</h3>
      <p>
        Res.Radio is a non-commercial community webradio based in Vienna to
        strengthen and display subcultural genres. From its founding in 2019,
        the radio grew into a multicultural community/platform featuring artists
        with many different backgrounds.
      </p>
      <a href="https://t.me/resradio" target="_blank" rel="noreferrer">
        <Button large>Join us!</Button>
      </a>
      {' '}
      <Link to={"page/donate"}>
        <Button large>Donate!</Button>
      </Link>
      <Social />
      <Grid />
      <div>
        <p className="copyright">
          <Logo className="logo" />
          <br />
          &copy; 2022
          <br />
          General inquiries
          <br />
          <a href="mailto:resradio.vienna@gmail.com">
            resradio.vienna@gmail.com
          </a>
        </p>
        <p>
          <Link to={"impressum"}>Impressum</Link>
        </p>
      </div>
    </Container>
  );
};

export default Footer;
