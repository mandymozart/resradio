import styled from "@emotion/styled";
import React from "react";
import { Link } from "react-router-dom";
import Divider from "../Divider";
import KeyFieldParagraph from "../KeyFieldParagraph";
import TeaserImage from "../TeaserImage/TeaserImage";
import Timeslots from "../Timeslots/Timeslots";

const Container = styled.div``;

const EventItem = ({ event }) => {
  return (
    <Container>
      <Link to={event.url}>
        <TeaserImage image={event.data.image} />
        <h3>{event.data.title}</h3>
      </Link>
      {event.data.body.length > 0 ? (
        <>
          {event.data.body.map((timeslots, index) => (
            <Timeslots key={index} timeslots={timeslots} />
          ))}
        </>
      ) : (
        <KeyFieldParagraph text={event.data.description} />
      )}
      <Divider />
    </Container>
  );
};
export default EventItem;
