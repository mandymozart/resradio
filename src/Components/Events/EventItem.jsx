import styled from "@emotion/styled";
import { PrismicLink } from "@prismicio/react";
import dayjs from "dayjs";
import React from "react";

const Container = styled.div`
h3 {
  font-family: var(--font-medium);
  font-size: 2rem;
  margin: 0;
  text-transform: initial;
}
  .timeslot {
    grid-template-columns: 2fr 3fr;
    gap: 1rem;
    display: grid;
  }
`;

const EventItem = ({ event }) => {
  return (
    <Container>
      <h3>{dayjs(event.data.begin).format("dddd, DD.MM.YYYY")} </h3>
      {event.data.body.length > 0 && (
        <>
          {event.data.body.map((timeslots, index) => (
            <span key={index}>
              {timeslots.items.map((timeslot, index) => {
                return (
                  <div className="timeslot" key={index}>
                    <div>
                      {dayjs(timeslot.from).format("HH:mm")}&mdash;{dayjs(timeslot.to).format("HH:mm")}
                    </div>
                    <PrismicLink field={timeslot.relatedshow}>
                      {timeslot.relatedshow.uid}
                    </PrismicLink>{" "}
                  </div>
                );
              })}
              <br />
            </span>
          ))}
        </>
      )}
    </Container>
  );
};
export default EventItem;
