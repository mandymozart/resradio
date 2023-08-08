import styled from '@emotion/styled';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@reach/tabs';
import React from "react";
import { useIdentityContext } from 'react-netlify-identity';
import CreateAccount from './Components/Account/CreateAccount';
import Dashboard from './Components/Account/Dashboard';
import LogIn from './Components/Account/Login';
import { BREAKPOINT_XS } from './config';
// code split the modal til you need it!

const Container = styled.div`
header {
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
.current {
  font-family: var(--font-bold);
}
[data-reach-tabs] {
  margin-top: 1rem;
}
button[role=tab] {
  margin-left: 2rem;
  &[aria-selected=true]{
    font-family: var(--font-bold);
  }
}
`

function Studio() {
  const { isLoggedIn } = useIdentityContext()

  return (
    <Container>
      <header>
        <h1>res.studio</h1>
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

