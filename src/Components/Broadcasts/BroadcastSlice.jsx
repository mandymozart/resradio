import styled from "@emotion/styled";
import React from "react";
import BroadcastSliceItem from "./BroadcastSliceItem";

const Container = styled.section`
`;

const BroadcastSlice = ({ slice }) => {
  return (
    <Container>
      {/* <h4>{slice.primary.title}</h4>
        <KeyFieldParagraph text={slice.primary.description} /> */}
      {slice.items.map((slice, index) => (
        <BroadcastSliceItem key={index} uid={slice.broadcast.uid} />
      ))}
    </Container>
  );
};
export default BroadcastSlice;
