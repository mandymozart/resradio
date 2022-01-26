import { css, Global } from "@emotion/react";
import styled from "@emotion/styled";
import Wave from "@foobar404/wave";
import clsx from "clsx";
import React, { useState } from "react";
import { BsFillLightningChargeFill } from "react-icons/bs";
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
  section {
    max-width: 100%;
    margin: 0 auto;
    pointer-events: visible;
  }
  header {
    z-index: 1000;
    display: grid;
    grid-template-columns: 6rem auto 6rem;
    align-items: center;
    a {
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
  section {
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    height: calc(100vh - 4rem);
    box-sizing: border-box;
    gap: 0.5rem;
    padding: 1rem;
    transition: all 0.5s cubic-bezier(1, 0, 0, 1);
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
      font-size: 2rem;
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

  let [wave] = useState(new Wave());

  wave.fromElement("#audioPlayer", "audioVisualizer", {
    type: "shine",
    colors: ["red", "white", "blue"],
  });

  const nightMode = useThemeStore((store) => store.nightMode);
  const setNightMode = useThemeStore((store) => store.setNightMode);

  const toggleOpen = (value) => {
    setIsOpen(value);
    wave.stopStream();
  };

  const goToLink = (link) => {
    setIsOpen(false);
    navigate(link);
  };

  return (
    <Container>
      <header className="glassomorphism">
        <a onClick={() => goToLink("/")}>
          <Logo />
          {/* <span>res</span>
          .radio */}
        </a>
        <AudioPlayer />
        <div>
          <Button
            type="button"
            active={isOpen}
            onClick={() => setIsOpen(!isOpen)}
          >
            MENU
          </Button>
        </div>
        {/* <Hamburger
          toggled={isOpen}
          toggle={toggleOpen}
          color={"var(--color)"}
        /> */}
      </header>
      <section className={clsx({ isOpen: isOpen }, "glassomorphism")}>
        <FadeIn>
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
              <a onClick={() => setNightMode(!nightMode)}>
                <BsFillLightningChargeFill />
              </a>
            </li>
          </ul>
        </FadeIn>
        {/* <FadeIn>
          <PlasticWrap />
        </FadeIn> */}
        {nightMode && (
          <>
            <Global
              styles={css`
                :root {
                  --color: #f2fefd;
                  --second: rgb(255, 0, 98);
                  /* --second: #88ff00; */
                  --background: rgba(1, 0, 9);
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
