import { usePrismicDocumentsByType } from "@prismicio/react";
import React, { useEffect, useState } from "react";
import { shuffle } from "../../utils";
import ShowItem from "./ShowItem";

const ShowList = () => {
  const [documents] = usePrismicDocumentsByType("shows",{
    pageSize: 200,
  });
  const [shows, setShows] = useState();

  useEffect(() => {
    if (documents) {
      setShows(shuffle(documents.results));
    }
  }, [shows, documents]);
  if (!documents && !shows) return <></>;
  return (
    <div>
      <p>{shows.length} shows!</p>
      {shows?.map((show) => (
        <ShowItem key={show.id} show={show}/>
      ))}
    </div>
  );
};
export default ShowList;
