import styled from "@emotion/styled";
import { usePrismicDocumentsByType } from "@prismicio/react";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FadeIn from "../../Animations/FadeIn";
import RandomShape from "../RandomShape";

const Container = styled.div`
  cursor: pointer;
  text-align: center;
  border: 1px solid var(--second);
  border-radius: 0.2rem;
  padding-top: 1.5rem; 
  h3 {
    font-size: 1.25rem;
    text-transform: uppercase;
    color: var(--second);
  }
  p {
    color: var(--second);
    margin-bottom: 1.5rem;
  }
  &.invert {
    background: var(--second);
    h3, p, svg {
      color: var(--background);
    }
  }
`;

const Announcement = () => {
  const [documents, { state }] = usePrismicDocumentsByType("announcement");
  const navigate = useNavigate();
    const [isHovered, setHovered] = useState(false);

     
  useEffect(() => {
  }, [documents, state, documents]);
  if (documents?.results_size !== 1) return <></>;
  if (state === "loaded")
    return (
      <Container
        onClick={() => navigate(documents.results[0].data.targetcontent.url)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={clsx({ invert: isHovered })}
      >
        <FadeIn>
          <RandomShape/>
          <h3>
            Announcement
          </h3>
          <p>{documents.results[0].data.text} ...</p>
        </FadeIn>
      </Container>
    );
};
export default Announcement;
