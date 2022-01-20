import styled from "@emotion/styled";
import { usePrismicDocumentsByType } from "@prismicio/react";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  text-align: center;
  line-height: 1rem;
  font-size: 1rem;
  padding: 1rem;
  min-height: 1rem;
  top: 0;
  left: 0;
  width: calc(100% - 2rem);
  color: var(--color);
  background: var(--background);
  cursor: pointer;
  a {
    text-decoration: underline;
  }
`;

const Announcement = () => {
  const [documents, {state}] = usePrismicDocumentsByType("announcement");
  const navigate = useNavigate();
  useEffect(() => {
    console.log(documents?.results_size, state);
  }, [documents, state, documents]);
  if (documents?.results_size !== 1) return <></>;
  if (state === "loaded")
  return (
    <Container
      onClick={() => navigate(documents.results[0].data.targetcontent.url)}
    >
      {documents.results[0].data.text} ... <a name="more">read more</a>
    </Container>
  );
};
export default Announcement;
