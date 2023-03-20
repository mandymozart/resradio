import { css, Global } from "@emotion/react";
import styled from "@emotion/styled";
import clsx from "clsx";
import React, { useState } from "react";
import { BrowserView, MobileView } from "react-device-detect";
import { BsMoon, BsSunFill } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import FadeIn from "./../Animations/FadeIn";
import Logo from "./../images/Logo";
import useThemeStore from "./../Stores/ThemeStore";
import Button from "./Button";
import Social from "./Social/Social";

const Container = styled.header`
  position: fixed;
  top: 0;
  z-index: 1000;
  width: 100%;
  background: transparent;
  box-sizing: border-box;
  background: var(--background);
  /* overflow: hidden; */
  header
  {
    display: grid;
    grid-template-columns: 6rem auto;
    align-items: center;
    > button {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0;
      margin-left: 1rem;
      border: 0;
      padding: 0;
      cursor: pointer;
      background: transparent;
    }
    > nav {
      text-align: right;
      width: 100%;
      > ul {
        padding: 0;
        margin: 0;
        list-style-type: none;
        margin-right: 1rem;
        > li {
          display: inline-block;
          padding: 0;
          margin: 0;
          margin-left: 0.5rem;
          text-align: center;
          > button {
            padding-left: 1rem;
            cursor: pointer;
            img {
              height: 1.5rem;
            }
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
      }
    }
  }
  > nav {
    z-index: 1000;
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    gap: 0.5rem;
    padding: 1rem;
    transition: transform 0.5s cubic-bezier(1, 0, 0, 1), opacity 0.5s ease-out;
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
        button {
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          border: none;
          text-transform: uppercase;
        }
      }
    }
    &.isOpen {
      opacity: 1;
      pointer-events: visible;
      transform: translateY(0);
      overflow: auto;
    }
  }
`;


const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const nightMode = useThemeStore((store) => store.nightMode);
  const setNightMode = useThemeStore((store) => store.setNightMode);

  const goToLink = (link) => {
    setIsOpen(false);
    navigate(link);
  };

  return (
    <Container>
        <button onClick={() => goToLink("/")}>
          <Logo />
        </button>
        <BrowserView>
        <nav>
          <ul>
            <li><Link to="shows">Shows</Link></li>
            <li><Link to="schedule">Schedule</Link></li>
            <li>CHAT <Social /></li>
          </ul>
        </nav>
        </BrowserView>
        <MobileView>
          <nav>
          <Button
                type="button"
                active={isOpen}
                onClick={() => setIsOpen(!isOpen)}
              >
                MENU
              </Button>
          </nav>
        </MobileView>
      {/* Mobile Menu */}
      <nav className={clsx({ isOpen: isOpen })}>
        <FadeIn>
          <ul>
            <li>
              <button onClick={() => goToLink("/shows")}>Shows</button>
            </li>
            <li>
              <button onClick={() => goToLink("/schedule")}>Schedule</button>
            </li>
            <li>
              <button onClick={() => setNightMode(!nightMode)}>
                {nightMode ? <BsSunFill /> : <BsMoon />}
              </button>
            </li>
          </ul>
        </FadeIn>
        {nightMode && (
          <>
            <Global
              styles={css`
                :root {
                  --color: var(--color-night);
                  --second: var(--second-night);
                  --background: var(--background-night);
                }
              `}
            />
          </>
        )}
      </nav>
    </Container>
  );
};

export default Header;
