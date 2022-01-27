import styled from "@emotion/styled";
import { usePrismicDocumentsByType } from "@prismicio/react";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FadeIn from "../../Animations/FadeIn";

const Container = styled.div`
  cursor: pointer;
`;

const Announcement = () => {
  const [documents, { state }] = usePrismicDocumentsByType("announcement");
  const navigate = useNavigate();
  useEffect(() => {
  }, [documents, state, documents]);
  if (documents?.results_size !== 1) return <></>;
  if (state === "loaded")
    return (
      <Container
        onClick={() => navigate(documents.results[0].data.targetcontent.url)}
      >
        <FadeIn>
          <h3>
            Announcement
          </h3>
          <p>{documents.results[0].data.text} ...</p>
          <a name="more">read more</a>
        </FadeIn>
      </Container>
    );
};
export default Announcement;
