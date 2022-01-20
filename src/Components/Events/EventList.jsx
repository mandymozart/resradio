import { usePrismicDocumentsByType } from "@prismicio/react";
import React from "react";
import EventItem from "./EventItem";

const EventList = () => {
  const [documents] = usePrismicDocumentsByType("events");
  if (!documents) return <></>;
  return (
    <div>
      {documents.results.map((event) => (
        <EventItem event={event} key={event.id}/>
      ))}
    </div>
  );
};

export default EventList;
