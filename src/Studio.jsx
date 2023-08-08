import styled from '@emotion/styled';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@reach/tabs';
import React from "react";
import { GoPerson, GoSignOut } from 'react-icons/go';
import { useIdentityContext } from 'react-netlify-identity';
import { Link } from 'react-router-dom';
import CreateAccount from './Components/Account/CreateAccount';
import Dashboard from './Components/Account/Dashboard';
import LogIn from './Components/Account/Login';
import Button from './Components/Button';
import { BREAKPOINT_MD, BREAKPOINT_XS } from './config';
// code split the modal til you need it!

const Container = styled.div`
header {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  @media (max-width: ${BREAKPOINT_MD}){
    grid-template-columns: 1fr 1fr;
  }
  align-items:center; 
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
`

function Studio() {
  const { isLoggedIn, user, logoutUser } = useIdentityContext()

  return (
    <Container>
      <header>
        <h1>res.studio</h1>
        <nav>
          <Link to="/studio/playlists">Playlists</Link>
        </nav>
        <Link to="/studio/remote">Remote</Link>
        <nav className='account'>
          <div>
            <GoPerson /> {user?.email}<br />
          </div>
          <div>
            <Button hasIcon ghost onClick={() => logoutUser()}><GoSignOut /></Button>
          </div>
        </nav>
      </header>
      {isLoggedIn ? <Dashboard /> : <>
        <Tabs>
          <TabList>
            <Tab>Login</Tab>
            <Tab>Create Account</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <LogIn />
            </TabPanel>
            <TabPanel>
              <CreateAccount />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </>
      }
    </Container>
  );
}

export default Studio;

