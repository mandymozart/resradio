import styled from "@emotion/styled";
import React from "react";
import Grid from "../images/Grid";
import Logo from "../images/Logo";
import Button from "./Button";
import Divider from "./Divider";
import Social from "./Social/Social";

const Container = styled.footer`
  padding: 1rem;
  max-width: var(--content-width);
  margin: 0 auto;

  text-align: center;

  background: var(--background);

`;

const Footer = () => {
  return (
    <Container>
      <Divider />
      <Logo />
      <p>
        Res.Radio is a non-commercial community webradio based in Vienna to
        strengthen and display subcultural genres. From its founding in 2019,
        the radio grew into a multicultural community/platform featuring artists
        with many different backgrounds.
      </p>
      <h3>WANT TO JOIN?</h3>
      <a
            href="https://discord.gg/Sm2N7HGdp9"
            target="_blank"
            rel="noreferrer"
          >
            <Button large>Join us!</Button>
          </a>
      <div>
        <Social/>
        <Grid />
        <p className="copyright">
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
        </p>
      </div>
    </Container>
  );
};

export default Footer;
