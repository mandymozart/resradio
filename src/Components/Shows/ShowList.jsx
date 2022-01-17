import { usePrismicDocumentsByType } from "@prismicio/react";
import React, { useEffect } from "react";

const ShowList = () => {
  const [documents] = usePrismicDocumentsByType("shows");
  useEffect(() => {
    console.log(documents);
  }, [documents]);
  if (!documents) return <></>;
  return (
    <div>
      {documents.results.map((show) => (
        <a key={show.id} target="_blank" rel="noreferr" href={show.data.soundcloud.author_url}>
          {show.data.title}
          <img width="100%" src={show.data.image.url} alt={show.data.image.alt} />
        </a>
      ))}
    </div>
  );
};
export default ShowList;
