import styled from "@emotion/styled";
import clsx from "clsx";
import Hamburger from "hamburger-react";
import React, { useState } from "react";
import { FaPause, FaPlay } from "react-icons/fa";
import { Link, NavLink } from "react-router-dom";

const Container = styled.div`
  position: sticky;
  top: 5rem;
  width: var(--content-width);
  margin: 0 auto;
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
    top: 6rem;
    width: var(--header-width);
    margin: 0 auto;
    background: rgba(255, 255, 255, 0.7);
    /* Hole */
    /* border: 2px solid var(--color); */
    box-sizing: border-box;
    border-radius: 1rem;
    z-index: 1000;
    backdrop-filter: blur(8px);
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 1rem;
    transition: all 0.5s ease-in;
    display: flex;
    opacity: 0;
    pointer-events: none;
    a button {
      width: 100%;
    }
    &.isOpen {
      opacity: 1;
      pointer-events: visible;
    }
  }
  .divider {
    flex: 1;
  }
  button {
    background: transparent;
    color: var(--color);
    border: 0;
    border-radius: 0.25rem;
    height: 3rem;
    padding: 0 2rem;
    cursor: pointer;
    font-weight: bold;
    line-height: 0.75rem;
  }
`;

const PlayButton = styled.button`
  position: relative;
  span {
    padding-left: 0.5rem;
  }
`;

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  return (
    <Container>
      <header>
        <PlayButton onClick={() => setIsPlaying(!isPlaying)}>
          {isPlaying ? <FaPause /> : <FaPlay />}
        </PlayButton>
        <Link to="/">
          {/* <img src={logo} alt="res.radio" /> */}
          <span>RES</span>
          .RADIO
        </Link>
        <Hamburger toggled={isOpen} toggle={setIsOpen} color={"var(--color)"} />
      </header>
      <section className={clsx({ isOpen: isOpen })}>
        <NavLink to={"/events"}>Schedule</NavLink>
        <NavLink to={"/shows"}>Shows</NavLink>
        <NavLink to={"/about"}>About</NavLink>
      </section>
    </Container>
  );
};

export default Navigation;
