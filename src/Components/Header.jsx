import styled from "@emotion/styled";
import React, { useState } from "react";
import { isBrowser, isMobile } from "react-device-detect";
import { Link, useNavigate } from "react-router-dom";
import Logo from "./../images/Logo";
import AudioPlayer from "./AudioPlayer/AudioPlayer";
import Button from "./Button";
import FilterPlayer from "./Filter/FilterPlayer";
import MobileMenu from "./MobileMenu";
import SlideOut from "./SlideOut";
import Social from "./Social/Social";
import VolumeButton from "./VolumeButton";

const Container = styled.header`
  position: fixed;
  top: 0;
  z-index: 1000;
  width: 100%;
  background: transparent;
  box-sizing: border-box;
  background: var(--background);
  button {
    background: none;
    border: none;
    padding: 0;
    margin: 0;
    cursor: pointer;
    &:hover {
      color: var(--second);
    }
  }
  nav.primary{
    display: grid;
    padding: 2rem 2rem 1rem 2rem;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 2rem;
    align-items: center;
    z-index: 1;
    justify-content: left;
    border-bottom: 2px solid var(--color);
  }
  .logo {
    text-align: left;
  }
  .tools {
    display: flex;
    justify-content: right;
    align-items: center;
    gap: 1rem;
  }

`;

const Topbar = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 0 2rem 0 2rem;
  gap: 0;
  border-bottom: 2px solid var(--color);
  > div:first-of-type {
    border-right: 2px solid var(--color);
  }
`

const ChatButton = styled.button`
  font-size: 1.5rem;
  font-family: var(--font-copy);
  text-transform: uppercase;
`

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  const goToLink = (link) => {
    setIsOpen(false);
    navigate(link);
  };

  return (
    <>
      <Container>
        <nav className="primary">
          <button className={"logo"} onClick={() => goToLink("/")}>
            <Logo />
          </button>
          {isBrowser && (
            <>
              <Link to="shows">Shows</Link>
              <Link to="schedule">Schedule</Link>
              <div className="tools">
                <ChatButton>Chat</ChatButton>
                <VolumeButton />
                <Social />
              </div>
            </>
          )}
          {isMobile && (
            <nav>
              <Button
                type="button"
                active={isOpen}
                onClick={() => setIsOpen(!isOpen)}
              >
                MENU
              </Button>
            </nav>
          )}
        </nav>
        <Topbar>
          <AudioPlayer isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
          <FilterPlayer isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        </Topbar>

      </Container>
      <SlideOut isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <MobileMenu isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
};

export default Header;
