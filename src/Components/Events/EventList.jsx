import { usePrismicDocumentsByType } from "@prismicio/react";
import React, { useEffect } from "react";

const EventList = () => {
    const [documents] = usePrismicDocumentsByType("events");
    useEffect(() => {
      console.log(documents);
    }, [documents]);
    if (!documents) return <></>;
    return (
      <div>
        {documents.results.map((event) => (
          <a key={event.id} target="_blank">
            {event.data.title}
            <img width="100%" src={event.data.image.url} alt={event.data.image.alt} />
            <p>{event.data.description}</p>
          </a>
        ))}
      </div>
    );
}
export default EventList;