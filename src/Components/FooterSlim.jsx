import styled from "@emotion/styled";
import React from "react";
import { Link } from "react-router-dom";
import { BREAKPOINT_MD, BREAKPOINT_XS } from "../config";

const Container = styled.footer`
  max-width: var(--content-width);
  @media (max-width: ${BREAKPOINT_MD}px) {
    font-size: 1rem;
  }
  nav {
    border-top: 1px solid var(--color);
    padding: 2rem;
    background-color: var(--grey);

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
        line-height: 1rem;
      gap: 2rem;
      margin:0;
      list-style-type: none;
      padding:0;
      a {
        
      }
    }
  }
`;

const FooterSlim = () => {
  return (
    <Container>
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

export default FooterSlim;
