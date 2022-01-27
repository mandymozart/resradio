import styled from "@emotion/styled";
import React from "react";
import FadeIn from "../../Animations/FadeIn";
import KeyFieldParagraph from "../KeyFieldParagraph";
import BroadcastSliceItem from "./BroadcastSliceItem";

const Container = styled.section`
  > div {
    margin-bottom: 3rem;
  }
`;

const BroadcastSlice = ({ slice }) => {
  return (
    <Container>
      <FadeIn>
        <h4>{slice.primary.title}</h4>
        <KeyFieldParagraph text={slice.primary.description} />
      </FadeIn>
      {slice.items.map((slice, index) => (
        <BroadcastSliceItem key={index} uid={slice.broadcast.uid} />
      ))}
    </Container>
  );
};
export default BroadcastSlice;
