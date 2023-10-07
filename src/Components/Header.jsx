import styled from "@emotion/styled";
import Hamburger from "hamburger-react";
import React, { useState } from "react";
import { GoComment } from "react-icons/go";
import { Link, useNavigate } from "react-router-dom";
import useChatStore from "../Stores/ChatStore";
import { BREAKPOINT_L, BREAKPOINT_MD, BREAKPOINT_XS } from "../config";
import Logo from "./../images/Logo";
import AudioPlayer from "./AudioPlayer/AudioPlayer";
import Button from "./Button";
import MobileMenu from "./MobileMenu";
import SearchBarToggle from "./Search/SearchBarToggle";
import SlideOut from "./SlideOut";
import VolumeButton from "./VolumeButton";

export const HeaderButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  cursor: pointer;
`
const Container = styled.header`
  position: fixed;
  top: 0;
  z-index: 1000;;
  width: 100%;
  background: transparent;
  box-sizing: border-box;
  background: var(--background);
 

  nav.primary {
    display: grid;  

    height: 7.5rem;
    box-sizing: border-box;
    padding:2rem;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 2rem;
    align-items: flex-start;
    z-index: 1;
    justify-content: left;
    border-bottom: 2px solid var(--color);
    @media (max-width: ${BREAKPOINT_MD}px) {
      grid-template-columns: 1fr 1fr;
    }
    @media (max-width: ${BREAKPOINT_XS}px) {
      padding: 2rem 1rem;
      gap: 1rem;
    }
  }

  .logo {
    text-align: left;
  }
  .link {
    @media (max-width: ${BREAKPOINT_MD}px) {
      display: none;
    }
    &--about {
      @media (max-width: ${BREAKPOINT_L}px) {
        display: none;
      }
    }
  }

  .menu-button {
    justify-content: flex-end;
    border: none;
    padding: 0;
    .hamburger-react {
      > div {
        height: 2px !important;
      }
    }
    @media (min-width: ${BREAKPOINT_MD - 1}px) {
      display: none;
    }
  }
  .tools {
    display: flex;
    justify-content: space-between;
    @media (max-width: ${BREAKPOINT_L}px) {
      justify-content: right;
    }
    @media (max-width: ${BREAKPOINT_MD}px) {
      display: none;
    }
    .icons {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 0.5em;
      button {
        font-size: 1.5rem;
      }
      @media (max-width: ${BREAKPOINT_MD}px) {
        display: none;
      }
    }
  }

`;

const Topbar = styled.div`
  box-sizing: border-box;
  border-bottom: 2px solid var(--color);
  min-height: calc(3rem + 2px);
`

const ChatButton = styled(HeaderButton)`
  font-size: 1.5rem;
  font-family: var(--font-copy);
  text-transform: uppercase;
  `


const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { isVisible, setIsVisible } = useChatStore();
  const navigate = useNavigate();

  const goToLink = (link) => {
    setIsOpen(false);
    navigate(link);
  };
  return (
    <>
      <Container>
        <nav className="primary">
          <HeaderButton className={"logo"} onClick={() => goToLink("/")}>
            <Logo />
          </HeaderButton>
          <Link to="explore" className="link">Explore</Link>
          <Link to="schedule" className="link">Schedule</Link>
          <div className="tools">
            <Link to="page/about" className="link link--about">About</Link>
            <div className="icons">
              <SearchBarToggle />
              <ChatButton onClick={() => setIsVisible(!isVisible)}><GoComment /></ChatButton>
              <VolumeButton />
            </div>
          </div>
          <Button
            type="button"
            className="menu-button"
            active={isOpen}
          >
            <Hamburger distance="sm" size={48} toggled={isOpen} onToggle={setIsOpen} />
          </Button>
        </nav>
        <Topbar>
          <AudioPlayer isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
        </Topbar>
      </Container>

      <SlideOut isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
      <MobileMenu isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
};

export default Header;
