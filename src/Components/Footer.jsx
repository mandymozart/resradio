import styled from "@emotion/styled";
import React from "react";
import { Link } from "react-router-dom";

const Container = styled.footer`
  max-width: var(--content-width);
  section {
    padding: 2rem;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 2rem;
    > div:first-of-type {
      grid-column: span 2;
    }
  }
  nav {
    border-top: 2px solid var(--color);
    padding: .5rem 2rem;
    ul {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      gap: 2rem;
      margin:0;
      list-style-type: none;
      padding:0;
      a {
        font-family: var(--font-bold);
      }
    }
  }
`;

const Footer = () => {
  return (
    <Container>
      <section>
        <div>
          <h3>ABOUT Res.Radio</h3>
          <p>
            We are res.radio community radio Vienna.</p>
          <p>
            Res.Radio is a non-commercial community webradio based in Vienna to strengthen
            and display subcultural genres. From its founding in 2019, the radio grew into
            a multicultural community/platform featuring artists with many different backgrounds.
            Within this platform people connect, exchange ideas and create content around
            music across all genres and talks, which addresses topics like contemporary
            culture, social injustice and other phenomena. Res.Radio is a space of diverse
            artistic freedom and is made from people for people.
          </p>
          <p>
            Support via donation:<br />
            Vienna Community Webradio<br />
            AT63 2011 1841 2411 3300<br />
            GIBAATWWXXX</p>
        </div>
        <div></div>
        <div>
          <h3>Contact us</h3>
          <p><a href="mailto:resradio.vienna@gmail.com">
            resradio.vienna@gmail.com
          </a></p>
          <p>
            Instagram<br />
            Telegram<br />
          </p>

        </div>
      </section>
      <nav>
        <ul>
          <li>
            <Link to={"impressum"}>Impressum</Link>
          </li>
          <li>
            <Link to={"impressum"}>General Inquiries</Link>
          </li>
        </ul>
      </nav>
    </Container>
  );
};

export default Footer;
