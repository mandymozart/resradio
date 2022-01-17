import { useAllPrismicDocumentsByType } from "@prismicio/react";
import React from "react";

const ShowList = () => {
  const [documents] = useAllPrismicDocumentsByType("show");
  return (
    <>
      {documents.map((document) => (
        <>{JSON.stringify(document)}</>
      ))}
    </>
  );
};
export default ShowList;
