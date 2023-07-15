import styled from '@emotion/styled';
import React from "react";
import { useIdentityContext } from 'react-netlify-identity';
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
`

function Studio() {
  const { user, isLoggedIn } = useIdentityContext()

  return (
    <Container>
      <header>
        <h1>res.studio</h1>
      </header>
      {isLoggedIn ? <Dashboard /> : <>
        <LogIn />
        {/* <CreateAccount /> */}
      </>
      }
    </Container>
  );
}

export default Studio;

