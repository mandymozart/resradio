import styled from "@emotion/styled";
import React from "react";
import Grid from "../../images/Grid";

const Container = styled.div`
  cursor: pointer;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  position: relative;
  margin-top: 8rem;
  .overlay {
    font-size: 1.5rem;
    font-family: var(--font-bold);
    color: var(--second);
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 6rem;
  }
  &.hover {
    color: var(--second);
    h3,
    div,
    svg {
      color: var(--second);
    }
  }
`;

const Bulletin = () => {

    return (
        <Container>
            <Grid />
            <div className="overlay">Host your own</div>
        </Container>
    );
};
export default Bulletin;
