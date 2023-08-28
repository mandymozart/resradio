import styled from "@emotion/styled";
import React from "react";
import { Link } from "react-router-dom";
import { BREAKPOINT_MD, BREAKPOINT_XS } from "../config";

const Container = styled.footer`
  max-width: var(--content-width);
  @media (max-width: ${BREAKPOINT_MD}px) {
    font-size: 1rem;
  }
  section {
    padding: 2rem;
    @media (max-width: ${BREAKPOINT_MD}px) {
      padding: 1rem;
    }    
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 2rem;
    > div:first-of-type {
      grid-column: span 3;
      @media (max-width: ${BREAKPOINT_MD}px) {
        grid-column: span 4;
      }
    }
    h3 {
      padding: 0;
      margin: 1rem 0 3rem;
      top: calc(50% - 8rem);
      @media (max-width: ${BREAKPOINT_MD}px) {
        font-size: 1rem;
        margin: 0;
      }
    }
  }
  nav {
    border-top: 1px solid var(--color);
    padding: 2rem;
    background-color: var(--grey);
    padding-bottom: 2rem;
    ul {
      display: grid;
      line-height: 2rem;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      @media (max-width: ${BREAKPOINT_MD}px) {
        grid-template-columns: 1fr 1fr;
      }
      @media (max-width: ${BREAKPOINT_XS}px) {
        grid-template-columns: 1fr;
        display: block;
        gap: 0;
      }
      li {
        @media (max-width: ${BREAKPOINT_XS}px) {
          
        }
      }
      font-family: var(--font-light);
        font-size: 1rem;
        line-height: 1.25rem;
      gap: 2rem;
      margin:0;
      list-style-type: none;
      padding:0;
      a {
        
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
        </div>
      </section>
      <nav>
        <ul>
          <li>
            <a href="mailto:resradio.vienna@gmail.com">Contact us</a>
          </li>
          <li>
            <a href="https://instagram.com/res.radio">Instagram</a><br />
            <a href="https://t.me/resradio">Telegram</a><br />
          </li>
          <li>
          </li>
          <li>
            <Link to={"/page/impressum"}>Impressum</Link><br />&copy; 2023
            <Link to={"/page/impressum"}>{" "}General Inquiries</Link>
          </li>
        </ul>
      </nav>
    </Container>
  );
};

export default Footer;
