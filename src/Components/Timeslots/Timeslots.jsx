import styled from "@emotion/styled";
import dayjs from "dayjs";
import React from "react";
import { Link } from "react-router-dom";
import FadeIn from "../../Animations/FadeIn";

const Container = styled.section`
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
            <Link to={timeslot.relatedshow.url}>
              {timeslot.relatedshow.slug}
            </Link>
          </FadeIn>
        );
      })}
    </Container>
  );
};
export default Timeslots;
