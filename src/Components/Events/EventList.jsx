import { usePrismicDocumentsByType } from "@prismicio/react";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import KeyFieldParagraph from "../KeyFieldParagraph";
import Timeslots from "../Timeslots/Timeslots";

const EventList = () => {
  const [documents] = usePrismicDocumentsByType("events");
  useEffect(() => {
    console.log(documents);
  }, [documents]);
  if (!documents) return <></>;
  return (
    <div>
      {documents.results.map((event) => (
        <div key={event.id}>
          <Link to={event.url}>
            <h3>{event.data.title}</h3>
            <img
              width="100%"
              src={event.data.image.url}
              alt={event.data.image.alt}
            />
          </Link>
          {event.data.body.length > 0 ? (
            <>
              {event.data.body.map((timeslots) => (
                <Timeslots timeslots={timeslots} />
              ))}
            </>
          ) : (
            <KeyFieldParagraph text={event.data.description} />
          )}
          <p style={{ textAlign: "center" }}>&mdash;</p>
        </div>
      ))}
    </div>
  );
};
export default EventList;
