import styled from "@emotion/styled";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";

const Container = styled.menu`
margin: 0;
padding: 0;
nav {
  z-index: 1000;
  position: fixed;
  top: 10.5rem;
  border-top: 2px solid var(--color);
  width: 100vw;
  height: calc(100vh - 6rem);
  display: flex;
  background-color: var(--background);
  align-items: flex-start;
  justify-content: center;
  box-sizing: border-box;
  gap: 0.5rem;
  transition: transform 0.5s cubic-bezier(1, 0, 0, 1), opacity 0.5s ease-out;
  z-index: 1000;
  transform: translateY(100vh);
  ul {
    margin: 0;
    padding: 0;
    width: 100%;
    text-align: center;
  }
  li {
    list-style-type: none;
    margin: 0;
    padding: 0;
    line-height: 3rem;
    border-bottom: 2px solid var(--color);
    background-color: var(--grey);
    button {
      width: 100%;
      font-size: 1.5rem;
      text-transform: uppercase;
    }
  }

  &.isOpen {
    pointer-events: visible;
    transform: translateY(0);
    overflow: auto;
  }
}
`
const MobileMenu = ({ isOpen, setIsOpen }) => {

  const navigate = useNavigate();

  const goToLink = (link) => {
    setIsOpen(false);
    navigate(link);
  };
  return (<Container>
    <nav className={clsx({ isOpen: isOpen })}>
      {/* <FadeIn> */}
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
          <button onClick={() => goToLink("/page/donate")}>Donate</button>
        </li>
        <li>
          <button onClick={() => goToLink("/search")}>Search</button>
        </li>
        <li>
          <button onClick={() => goToLink("/chat")}>Chat</button>
        </li>
      </ul>
      {/* </FadeIn> */}
    </nav>
  </Container>
  )
}

export default MobileMenu;