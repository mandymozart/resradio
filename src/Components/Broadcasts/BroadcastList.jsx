import styled from "@emotion/styled";
import * as prismic from "@prismicio/client";
import { usePrismicDocumentsByType } from "@prismicio/react";
import React from "react";
import FadeIn from "../../Animations/FadeIn";
import Divider from "../Divider";
import BroadcastItem from "./BroadcastItem";

const Container = styled.section`
  h3 {
    text-transform: capitalize;
  }
`

const BroadcastList = ({ tag }) => {
  const [documents] = usePrismicDocumentsByType("broadcasts", {
    predicates: [prismic.predicate.at("document.tags", [tag])],
      fetchLinks: "data.hostedby.title",
  });
  if (!documents || documents.results.length < 1) return <></>;
  return (
    <Container>
      <FadeIn>
        <h3>{tag}</h3>
      </FadeIn>
      {documents.results.map((broadcast) => (
        <BroadcastItem broadcast={broadcast} key={broadcast.id} />
      ))}
      <Divider />
    </Container>
  );
};

export default BroadcastList;
