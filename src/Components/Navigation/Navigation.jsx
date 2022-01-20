import { css, Global } from "@emotion/react";
import styled from "@emotion/styled";
import clsx from "clsx";
import Hamburger from "hamburger-react";
import React, { useState } from "react";
import { BsFillLightningChargeFill } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import AudioPlayer from "../AudioPlayer/AudioPlayer";

const Container = styled.div`
  position: fixed;
  top: 5rem;
  width: 100%;
  pointer-events: none;
  line-height: 4rem;
  background: transparent;
  box-sizing: border-box;
  /* overflow: hidden; */
  header, section {
    width: calc(var(--content-width) - 2rem);
    margin: 0 auto;
    pointer-events: visible;
  }
  header {
    z-index: 1000;
    border-radius: 1rem;
    display: grid;
    grid-template-columns: 4rem auto 4rem;
    align-items: center;
    a {
      cursor: pointer;
      img {
        height: 4rem;
      }
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  section {
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    margin-top: 1rem;
    height: calc(100vh - 15rem);
    box-sizing: border-box;
    border-radius: 1rem;
    gap: 0.5rem;
    padding: 1rem;
    transition: all 0.5s cubic-bezier(1,0,0,1);
    opacity: 0;
    z-index: 1000;
    transform: translateY(100vh);
    
    ul {
      padding: 0;
      margin: 0;
      list-style-type: none;
      li {
        padding: 0;
        margin: 0;
        text-align: center;
      }
    }
    a {
      cursor: pointer;
    }
    &.isOpen {
      opacity: 1;
      pointer-events: visible;
      transform: translateY(0);
    }
  }
`;

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const [showTheme, setShowTheme] = useState(false);

  const toggleOpen = (value) => {
    setIsOpen(value);
  };

  const goToLink = (link) => {
    setIsOpen(false);
    navigate(link);
  };

  return (
    <Container>
      <header className="glassomorphism">
        <AudioPlayer />
        <Link to="/">
          {/* <img src={logo} alt="res.radio" /> */}
          <span>RES</span>
          .RADIO
        </Link>
        <Hamburger
          toggled={isOpen}
          toggle={toggleOpen}
          color={"var(--color)"}
        />
      </header>
      <section className={clsx({ isOpen: isOpen }, "glassomorphism")}>
        <ul>
          <li>
            <a onClick={() => goToLink("/events")}>Schedule</a>
          </li>
          <li>
            <a onClick={() => goToLink("/shows")}>Shows</a>
          </li>
          <li>
            <a onClick={() => goToLink("/about")}>About</a>
          </li>
          <li>
            <a onClick={() => setShowTheme(!showTheme)}>
              <BsFillLightningChargeFill />
            </a>
          </li>
        </ul>
        {showTheme && (
          <>
            <Global
              styles={css`
                :root {
                  --color: #ff0062;
                  --second: #88ff00;
                  --background: rgb(1, 0, 9);
                }
                .glassomorphism {
                  background: rgba(1, 0, 9, 0.2);
                }
              `}
            />
          </>
        )}
      </section>
    </Container>
  );
};

export default Navigation;
