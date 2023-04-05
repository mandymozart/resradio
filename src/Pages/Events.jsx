import styled from "@emotion/styled";
import React from "react";
import EventList from "../Components/Events/EventList";

const Container = styled.section`
display: grid;
grid-template-columns: 1fr 1fr 1fr 1fr;
gap: 2rem;
padding: 2rem;
border-bottom: 2px solid var(--color);
h2 {
  margin-bottom: 5rem;
}
> div {
  background: var(--yellow);
  padding: 2rem;
  font-size: 2rem;
  color: var(--second);
  font-family: var(--font-medium);
  grid-column: span 2;
  a {
    color: var(--second);
  }
}
`

const Events = () => {

  return (
    <Container>
      <div>
        <h2>Schedule</h2>
        <EventList />
      </div>
    </Container>
  );
};

export default Events;
