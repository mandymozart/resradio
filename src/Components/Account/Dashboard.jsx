import styled from '@emotion/styled';
import React from "react";
import { useIdentityContext } from 'react-netlify-identity';
import { Link, Outlet } from 'react-router-dom';
import { BREAKPOINT_XS } from '../../config';
import Button from '../Button';
// code split the modal til you need it!

const Container = styled.div`
header {
  padding: 2rem;
  border-bottom: 2px solid var(--color); 
  h2 {
    font-size: 1.5rem;
  }
  @media (max-width: ${BREAKPOINT_XS}px) {
    padding: 1rem;
    font-size: 1rem;
  }
}
.current {
  font-family: var(--font-bold);
}
`

function Dashboard() {
  const { user, logoutUser } = useIdentityContext();
  return (
    <Container>
      <header>
        {user?.email}<br />
        <Button onClick={() => logoutUser()}>Log out</Button>
        <br /><br />
        <nav>
          <Link to="/studio/playlists">Playlists</Link>
        </nav>
      </header>
      <div>
        <Outlet />
      </div>
    </Container>
  );
}

export default Dashboard;

