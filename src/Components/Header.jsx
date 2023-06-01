import styled from "@emotion/styled";
import Hamburger from "hamburger-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BREAKPOINT_L, BREAKPOINT_MD } from "../config";
import Chat from "../images/Chat";
import Logo from "./../images/Logo";
import AudioPlayer from "./AudioPlayer/AudioPlayer";
import Button from "./Button";
import DonationBar from "./Donation/DonationBar";
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
  z-index: 1000;
  width: 100%;
  background: transparent;
  box-sizing: border-box;
  background: var(--background);

  nav.primary{
    display: grid;  

    height: 7.5rem;
    box-sizing: border-box;
    padding:2rem;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    @media (max-width: ${BREAKPOINT_MD}px) {
      grid-template-columns: 1fr 1fr;
    }
    gap: 2rem;
    align-items: flex-start;
    z-index: 1;
    justify-content: left;
    border-bottom: 2px solid var(--color);
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
      @media (max-width: ${BREAKPOINT_MD}px) {
        display: none;
      }
    }
  }

`;

const Topbar = styled.div`
  box-sizing: border-box;
  border-bottom: 2px solid var(--color);
`

const ChatButton = styled(HeaderButton)`
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
          <HeaderButton className={"logo"} onClick={() => goToLink("/")}>
            <Logo />
          </HeaderButton>
          <Link to="explore" className="link">Explore</Link>
          <Link to="schedule" className="link">Schedule</Link>
          <div className="tools">
            <Link to="page/about" className="link link--about">About</Link>
            <div className="icons">
              <ChatButton><Chat /></ChatButton>&nbsp;
              <VolumeButton />
              <SearchBarToggle />
            </div>
          </div>
          <Button
            type="button"
            className="menu-button"
            active={isOpen}
            onClick={() => setIsOpen(!isOpen)}
          >
            <Hamburger />
          </Button>
        </nav>
        <Topbar>
          <AudioPlayer isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
          {/* <FilterPlayer isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} /> */}
        </Topbar>
        <DonationBar />
      </Container>

      <SlideOut isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <MobileMenu isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
};

export default Header;
