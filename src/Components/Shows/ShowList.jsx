import { usePrismicDocumentsByType } from "@prismicio/react";
import React from "react";
import { Link } from "react-router-dom";

const ShowList = () => {
  const [documents] = usePrismicDocumentsByType("shows");
  if (!documents) return <></>;
  return (
    <div>
      {documents.results.map((show) => (
        <Link key={show.id} to={show.url}>
          {show.data.title}
          <img width="100%" src={show.data.image.url} alt={show.data.image.alt} />
        </Link>
      ))}
    </div>
  );
};
export default ShowList;
