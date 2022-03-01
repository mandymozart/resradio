import styled from "@emotion/styled";
import { PrismicLink } from "@prismicio/react";
import dayjs from "dayjs";
import React from "react";
import FadeIn from "../../Animations/FadeIn";

const Container = styled.section`
text-transform: uppercase;
  span {
    font-size: 1.5rem;
  }
  p {
    margin: 0;
  }
`;

const Timeslots = ({ timeslots }) => {
  return (
    <Container>
      {timeslots.items.map((timeslot) => {
        return (
          <FadeIn key={`timeslot-${timeslot.from}-${timeslot.to}`}>
            <span>
              {dayjs(timeslot.from).format("HH:mm")} &mdash;{" "}
              {dayjs(timeslot.to).format("HH:mm")}
            </span>
            <br />
            <PrismicLink field={timeslot.relatedshow}>
              {timeslot.relatedshow.uid}
            </PrismicLink>
          </FadeIn>
        );
      })}
    </Container>
  );
};
export default Timeslots;
