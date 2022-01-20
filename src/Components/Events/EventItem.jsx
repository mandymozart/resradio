import styled from "@emotion/styled";
import clsx from "clsx";
import React from "react";
import { isDesktop } from "react-device-detect";
import { Link } from "react-router-dom";
import Divider from "../Divider";
import KeyFieldParagraph from "../KeyFieldParagraph";
import TeaserImage from "../TeaserImage/TeaserImage";
import Timeslots from "../Timeslots/Timeslots";

const Container = styled.div`
  .isDesktop {
    display: flex;
    gap: 1rem;
    justify-content: center;
    align-items: center;
    font-size: 1.5rem;
    & > div {
        width: 20rem;
    }
    & > h3 {
        flex: 100%;
    }
  }

`;

const EventItem = ({ event }) => {
  return (
    <Container >
      <Link to={event.url} className={clsx({isDesktop: isDesktop})}>
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
