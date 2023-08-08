import styled from '@emotion/styled';
import React from "react";
import { Outlet } from 'react-router-dom';
import { BREAKPOINT_XS } from '../../config';
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
  return (
    <Container>
      <div>
        <Outlet />
      </div>
    </Container>
  );
}

export default Dashboard;

