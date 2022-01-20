import { PrismicRichText, usePrismicDocumentsByType } from "@prismicio/react";
import React, { useEffect } from "react";
import useThemeStore from "../../Stores/ThemeStore";

const About = () => {
  const [documents] = usePrismicDocumentsByType("about");
  const setKeyword = useThemeStore((store) => store.setKeyword);

  useEffect(() => {
    console.log(documents);
  }, [documents]);
  if (!documents) return <></>;
  if (documents.results[0].data.keyword !== "") setKeyword(documents.results[0].data.keyword);
  return (
    <div>
      <h1>{documents.results[0].data.title}</h1>
      <PrismicRichText field={documents.results[0].data.content} />
    </div>
  );
};
export default About;
