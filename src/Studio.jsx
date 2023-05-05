import styled from '@emotion/styled';
import React from "react";
import { useIdentityContext } from 'react-netlify-identity';
import { Link, Outlet } from 'react-router-dom';
// code split the modal til you need it!

const Container = styled.div`
header {
  padding: 2rem;
  border-bottom: 2px solid var(--color); 
}
.current {
  font-family: var(--font-bold);
}
`

function Studio() {
  const { user, logOut, isLoggedIn } = useIdentityContext()

  return (
    <Container>
      <header>
        <h1>res.studio</h1>
        Hello {isLoggedIn ? `Hello ${user?.email}, Log out here!` : 'Log In'}
        {!isLoggedIn ? <><button onClick={logOut}>
          Log out
        </button></> : (<>Logged In</>)}
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

export default Studio;

