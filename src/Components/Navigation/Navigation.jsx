import styled from "@emotion/styled";
import clsx from "clsx";
import React, { useState } from "react";
import { BrowserView } from "react-device-detect";
import { useNavigate } from "react-router-dom";
import FadeIn from "../../Animations/FadeIn";
import Logo from "../../images/Logo";
import useThemeStore from "../../Stores/ThemeStore";
import AudioPlayer from "../AudioPlayer/AudioPlayer";
import Button from "../Button";

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
    grid-template-columns: 6rem auto auto;
    align-items: center;
    > a {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-left: 1rem;
      cursor: pointer;
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
    }
  }
`;

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // const nightMode = useThemeStore((store) => store.nightMode);
  // const setNightMode = useThemeStore((store) => store.setNightMode);
  const showGifs = useThemeStore((store) => store.showGifs);
  const setShowGifs = useThemeStore((store) => store.setShowGifs);

  const goToLink = (link) => {
    setIsOpen(false);
    navigate(link);
  };

  return (
    <Container>
      <header className="glassomorphism">
        <a onClick={() => goToLink("/")}>
          <Logo />
        </a>
        <AudioPlayer />
        <nav>
          <ul>
            {/* <li>
              <a onClick={() => setNightMode(!nightMode)}>
                {nightMode ? <BsSunFill /> : <BsMoon />}
              </a>
            </li> */}
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
      <nav className={clsx({ isOpen: isOpen }, "glassomorphism")}>
        <FadeIn>
          <ul>
            <li>
              <a onClick={() => goToLink("/broadcasts")}>Broadcasts</a>
            </li>
            <li>
              <a onClick={() => goToLink("/shows")}>Shows</a>
            </li>
            <li>
              <a onClick={() => goToLink("/events")}>Schedule</a>
            </li>
            <li>
              <a onClick={() => goToLink("/about")}>About</a>
            </li>
            <li>
              <a onClick={() => goToLink("/page/donate")}>Donate!</a>
            </li>
            <BrowserView>
              <li>
                <a onClick={() => setShowGifs(!showGifs)}>
                  Gifs {showGifs ? "off" : "on"}
                </a>
              </li>
            </BrowserView>
          </ul>
        </FadeIn>
        {/* nightMode && (
          <>
            <Global
              styles={css`
                :root {
                  --color: #f2fefd;
                  --second: #faff00;
                  --background: rgb(0, 28, 99);
                }
                .glassomorphism {
                  background: rgb(0, 28, 99, 0.9);
                }
                @supports (-webkit-backdrop-filter: none) or
                  (backdrop-filter: none) {
                  background: rgba(0, 40, 143, 0.2);
                }
              `}
            />
          </>
              )*/}
      </nav>
    </Container>
  );
};

export default Navigation;
