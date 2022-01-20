import { PrismicRichText, usePrismicDocumentsByType } from "@prismicio/react";
import React, { useEffect } from "react";
import useThemeStore from "../../Stores/ThemeStore";

const About = ({ hideContent }) => {
  const [documents] = usePrismicDocumentsByType("about");
  const setKeyword = useThemeStore((store) => store.setKeyword);
  useEffect(() => {
    if (documents && !hideContent)
      setKeyword(documents.results[0].data.keyword);
  }, [setKeyword, documents, hideContent]);
  if (!documents) return <></>;
  return (
    <div>
      <h1>{documents.results[0].data.title}</h1>
      {!hideContent && (
        <PrismicRichText field={documents.results[0].data.content} />
      )}
    </div>
  );
};
export default About;
