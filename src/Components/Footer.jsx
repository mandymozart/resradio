import styled from "@emotion/styled";
import React from "react";

const Container = styled.footer`
  padding: 1rem;
  max-width: var(--content-width);
  margin: 0 auto;

  text-align: left;

  background: var(--background);
`;

const Footer = () => {
  return (
    <Container>
      <h3>res.radio</h3>
      <p>
        Res.Radio is a non-commercial community webradio based in Vienna to
        strengthen and display subcultural genres. From its founding in 2019,
        the radio grew into a multicultural community/platform featuring artists
        with many different backgrounds. 
      </p>
      <p>
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
    </Container>
  );
};

export default Footer;
