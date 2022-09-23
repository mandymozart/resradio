import { usePrismicDocumentsByType } from "@prismicio/react";
import React from "react";
import EventItem from "./EventItem";

const EventList = () => {
  const [documents] = usePrismicDocumentsByType("events", {
    orderings: {
      field: 'my.events.begin',
      direction: 'desc',
    },
  });
  if (!documents) return <></>;
  return (
    <div>
      {documents?.results.map((event) => {
        // if (dayjs(event.data.begin).format("MMM D, h:mm A"))
        // TODO: sort by date here
        return <EventItem event={event} key={event.id} />;
      })}
    </div>
  );
};

export default EventList;
