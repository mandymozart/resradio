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

function Dashboard() {
    const { user, logoutUser } = useIdentityContext()
    console.log(user)


    return (
        <Container>
            <header>
                <h2>
                    Hello {user?.email} (<button onClick={() => logoutUser()}>Log out</button>)
                </h2>
                <nav>
                    <Link to="/studio/playlists">All</Link>
                </nav>
            </header>
            <div>
                <Outlet />
            </div>
        </Container>
    );
}

export default Dashboard;

