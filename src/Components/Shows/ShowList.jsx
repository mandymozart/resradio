import { usePrismicDocumentsByType } from "@prismicio/react";
import React, { useEffect, useState } from "react";
import { shuffle } from "../../utils";
import ShowItem from "./ShowItem";

const ShowList = () => {
  const [documents] = usePrismicDocumentsByType("shows");
  const [shows, setShows] = useState();

  useEffect(() => {
    if (documents) {
      setShows(shuffle(documents.results));
    }
  }, [shows, documents]);
  if (!documents && !shows) return <></>;
  return (
    <div>
      {shows?.map((show) => (
        <ShowItem key={show.id} show={show}/>
      ))}
    </div>
  );
};
export default ShowList;
