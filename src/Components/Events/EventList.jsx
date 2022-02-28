import { usePrismicDocumentsByType } from "@prismicio/react";
import React from "react";
import FadeIn from "../../Animations/FadeIn";
import EventItem from "./EventItem";

const EventList = () => {
  const [documents] = usePrismicDocumentsByType("events", 
  {
    fetchLinks: "timeslot.relatedshow.slug",
  }
  );
  if (!documents) return <></>;
  return (
    <div>
      <FadeIn>
        <h3>Up next</h3>
      </FadeIn>
      {documents?.results.map((event) => (
        <EventItem event={event} key={event.id} />
      ))}
    </div>
  );
};

export default EventList;
