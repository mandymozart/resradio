import { usePrismicDocumentsByType } from "@prismicio/react";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const EventList = () => {
    const [documents] = usePrismicDocumentsByType("events");
    useEffect(() => {
      console.log(documents);
    }, [documents]);
    if (!documents) return <></>;
    return (
      <div>
        {documents.results.map((event) => (
          <Link key={event.id} to={event.url}>
            {event.data.title}
            <img width="100%" src={event.data.image.url} alt={event.data.image.alt} />
            <p>{event.data.description}</p>
          </Link>
        ))}
      </div>
    );
}
export default EventList;