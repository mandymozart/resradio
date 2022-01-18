import { css, Global } from "@emotion/react";
import styled from "@emotion/styled";
import clsx from "clsx";
import Hamburger from "hamburger-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AudioPlayer from "../AudioPlayer/AudioPlayer";

const Container = styled.div`
  position: sticky;
  top: 5rem;
  width: calc(var(--content-width) - 2rem);
  margin: 0 auto;
  line-height: 4rem;
  background: rgba(255, 255, 255, 0.7);
  /* Hole */
  /* border: 2px solid var(--color); */
  box-sizing: border-box;
  /* Up 1 */
  /* box-shadow: 4px 4px 0px var(--color); */
  border-radius: 1rem;
  z-index: 1000;
  backdrop-filter: blur(8px);
  header {
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
    pointer-events: none;
    display: none;
    flex-direction: column;
    position: fixed;
    top: 5rem;
    height: calc(100vh - 11rem);
    width: 100%;
    margin: 0 auto;
    background: var(--background);
    /* Hole */
    box-sizing: border-box;
    border-radius: 1rem;
    z-index: 1000;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 1rem;
    transition: all 0.5s ease-in;
    display: flex;
    opacity: 0;
    pointer-events: none;
    a {
      cursor: pointer;
    }
    &.isOpen {
      opacity: 1;
      pointer-events: visible;
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
      <header>
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
      <section className={clsx({ isOpen: isOpen })}>
        <a onClick={() => goToLink("/events")}>Schedule</a>
        <a onClick={() => goToLink("/shows")}>Shows</a>
        <a onClick={() => goToLink("/about")}>About</a>
        <a onClick={() => setShowTheme(!showTheme)}>Toggle Theme</a>
        {showTheme && (
          <div>
            <Global
              styles={css`
                :root {
                  --color: blue;
                  --second: #8000ff;
                  --background: red;
                }
              `}
            />
          </div>
        )}
      </section>
    </Container>
  );
};

export default Navigation;
