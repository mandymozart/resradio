import { usePrismicDocumentsByType } from "@prismicio/react";
import React, { useEffect } from "react";

const About = () => {
  const [documents] = usePrismicDocumentsByType("about");
  useEffect(() => {
    console.log(documents);
  }, [documents]);
  if (!documents) return <></>;
  return (
    <div
      
    >
        <h1>
            {documents.results[0].data.title}
        </h1>
        {/* <PrismicRichText field={document.data.example_rich_text} />
      {documents.results[0].data.text} */}
    </div>
  );
};
export default About;
