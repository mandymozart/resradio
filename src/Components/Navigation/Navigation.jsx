import { css, Global } from "@emotion/react";
import styled from "@emotion/styled";
import clsx from "clsx";
import React, { useState } from "react";
import { BrowserView } from "react-device-detect";
import { BsMoon, BsSunFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import FadeIn from "../../Animations/FadeIn";
import Logo from "../../images/Logo";
import useThemeStore from "../../Stores/ThemeStore";
import AudioPlayer from "../AudioPlayer/AudioPlayer";
import Button from "../Button";
import BroadcastInfo from "./../AudioPlayer/BroadcastInfo";
import FilterPlayer from "../Filter/FilterPlayer";

const Container = styled.div`
  position: fixed;
  top: 0;
  width: 100%;
  pointer-events: none;
  line-height: 4rem;
  background: transparent;
  box-sizing: border-box;
  /* overflow: hidden; */
  header,
  > nav {
    max-width: 100%;
    margin: 0 auto;
    pointer-events: visible;
  }
  header {
    z-index: 1000;
    display: grid;
    grid-template-columns: 6rem auto;
    align-items: center;
    > button {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-left: 1rem;
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
          > a {
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
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    height: calc(100vh - 4rem);
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
        a {
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          cursor: pointer;
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

const StyledPlayers = styled.div`
  display: flex;
  gap: 1rem;
  > div {
    flex: 1;
  }

`

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const nightMode = useThemeStore((store) => store.nightMode);
  const setNightMode = useThemeStore((store) => store.setNightMode);
  const showGifs = useThemeStore((store) => store.showGifs);
  const setShowGifs = useThemeStore((store) => store.setShowGifs);

  const goToLink = (link) => {
    setIsOpen(false);
    navigate(link);
  };

  return (
    <Container>
      <BroadcastInfo />
      <header className="glassomorphism">
        <button onClick={() => goToLink("/")}>
          <Logo />
        </button>
        <nav>
          <ul>
            <li>
              <button onClick={() => setNightMode(!nightMode)}>
                {nightMode ? <BsSunFill /> : <BsMoon />}
              </button>
            </li>
            <li>
              <Button
                type="button"
                active={isOpen}
                onClick={() => setIsOpen(!isOpen)}
              >
                MENU
              </Button>
            </li>
          </ul>
        </nav>
      </header>
      <StyledPlayers>
        <AudioPlayer />
        <FilterPlayer />
      </StyledPlayers>
      <nav className={clsx({ isOpen: isOpen }, "glassomorphism")}>
        <FadeIn>
          <ul>
            <li>
              <button onClick={() => goToLink("/broadcasts")}>Broadcasts</button>
            </li>
            <li>
              <button onClick={() => goToLink("/shows")}>Shows</button>
            </li>
            <li>
              <button onClick={() => goToLink("/events")}>Schedule</button>
            </li>
            <li>
              <button onClick={() => goToLink("/about")}>About</button>
            </li>
            <li>
              <button onClick={() => goToLink("/page/donate")}>Donate!</button>
            </li>
            <BrowserView>
              <li>
                <button onClick={() => setShowGifs(!showGifs)}>
                  Gifs {showGifs ? "off" : "on"}
                </button>
              </li>
            </BrowserView>
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
                .glassomorphism {
                  background: var(--background-night-translucent);
                }
                @supports (-webkit-backdrop-filter: none) or
                  (backdrop-filter: none) {
                  background: var(---background-night-blurred);
                }
              `}
            />
          </>
        )}
      </nav>
    </Container>
  );
};

export default Navigation;
