import styled from "@emotion/styled";
import React from "react";
import { GoListOrdered, GoPerson, GoSignOut } from "react-icons/go";
import { useIdentityContext } from "react-netlify-identity";
import { Link } from "react-router-dom";
import CreateAccount from "./Components/Account/CreateAccount";
import Dashboard from "./Components/Account/Dashboard";
import LogIn from "./Components/Account/Login";
import Button from "./Components/Button";
import { BREAKPOINT_MD, BREAKPOINT_XS } from "./config";
// code split the modal til you need it!

const Container = styled.div`
  header {
    display: grid;
    grid-template-columns: 1fr 2fr 1fr;
    @media (max-width: ${BREAKPOINT_MD}) {
      grid-template-columns: 1fr 1fr;
    }
    gap: 1rem;
    align-items: center;
    padding: 2rem;
    border-bottom: 2px solid var(--color);
    background-color: var(--grey);
    @media (max-width: ${BREAKPOINT_XS}px) {
      padding: 1rem;
    }
  }
  h1 {
    margin: 0;
  }
  .account {
    font-size: 1rem;
    display: flex;
    align-items: center;
    justify-content: end;
    gap: 0.75rem;
  }
  .menu {
    a {
      font-size: 1rem;
      margin-right: 1rem;
      @media (max-width: ${BREAKPOINT_XS}px) {
        span {
          display: none;
        }
      }
    }
  }
  .login {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
`;

function Studio() {
  const { isLoggedIn, user, logoutUser } = useIdentityContext();

  return (
    <Container>
      <header>
        <h1>res.studio</h1>
        <nav className="menu">
          <Link to="/studio/playlists">
            <GoListOrdered />
            <span> Playlists</span>
          </Link>
        </nav>
        <nav className="account">
          <div>
            <GoPerson /> {user?.email}
            <br />
          </div>
          <div>
            <Button hasIcon ghost onClick={() => logoutUser()}>
              <GoSignOut />
            </Button>
          </div>
        </nav>
      </header>
      {isLoggedIn ? (
        <Dashboard />
      ) : (
        <div className="login">
          <LogIn />
          <CreateAccount />
        </div>
      )}
    </Container>
  );
}

export default Studio;
