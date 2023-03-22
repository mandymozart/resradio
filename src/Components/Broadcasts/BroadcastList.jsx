import styled from "@emotion/styled";
import React from "react";
import BroadcastItem from "./BroadcastItem";

const Container = styled.section`
  .list {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
`

const BroadcastList = ({ broadcasts }) => {
  if (!broadcasts) return <></>;
  return (
    <Container>

      <div class="list">

        {broadcasts.map((broadcast) => (
          <BroadcastItem broadcast={broadcast} key={broadcast.id} />
        ))}
      </div>
    </Container>
  );
};

export default BroadcastList;
