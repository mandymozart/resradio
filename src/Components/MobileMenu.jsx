import { css, Global } from "@emotion/react";
import styled from "@emotion/styled";
import clsx from "clsx";
import { BsMoon, BsSunFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import useThemeStore from "../Stores/ThemeStore";
import FadeIn from "./../Animations/FadeIn";

const Container = styled.menu`
margin: 0;
padding: 0;
nav {
  z-index: 1000;
  position: fixed;
  top: 6rem;
  width: 100vw;
  height: calc(100vh - 6rem);
  display: flex;
  background-color: var(--background);
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
    margin: 0;
    padding: 0;
    text-align: center;
  }
  li {
    list-style-type: none;
    margin: 0;
    padding: 0;
    line-height: 4rem;
    button {
      font-size: 2rem;
    }
  }

  &.isOpen {
    opacity: 1;
    pointer-events: visible;
    transform: translateY(0);
    overflow: auto;
  }
}
`
const MobileMenu = ({ isOpen, setIsOpen }) => {

  const nightMode = useThemeStore((store) => store.nightMode);
  const setNightMode = useThemeStore((store) => store.setNightMode);

  const navigate = useNavigate();

  const goToLink = (link) => {
    setIsOpen(false);
    navigate(link);
  };
  return (<Container>
    <nav className={clsx({ isOpen: isOpen })}>
      <FadeIn>
        <ul>
          <li>
            <button onClick={() => goToLink("/explore")}>Explore</button>
          </li>
          <li>
            <button onClick={() => goToLink("/schedule")}>Schedule</button>
          </li>
          <li>
            <button onClick={() => goToLink("/page/about")}>About</button>
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
  )
}

export default MobileMenu;