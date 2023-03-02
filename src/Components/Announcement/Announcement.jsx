import styled from "@emotion/styled";
import { usePrismicDocumentsByType } from "@prismicio/react";
import clsx from "clsx";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  cursor: pointer;
  border: 1px solid var(--second);
  border-radius: 0.2rem;
  padding: 1.5rem;
  background: var(--background);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  div {
    font-size: 1.5rem;
    color: var(--second);
  }
  &.invert {
    background: var(--second);
    h3,
    div,
    svg {
      color: var(--background);
    }
  }
`;

const Announcement = () => {
  const [documents, { state }] = usePrismicDocumentsByType("announcement");
  const navigate = useNavigate();
  const [isHovered, setHovered] = useState(false);

  const handleClick = () => {
    if (documents.results[0].data.link.link_type === "Document")
      navigate(documents.results[0].data.link.url);
    if (documents.results[0].data.link.link_type === "Web") {
      if ((documents.results[0].data.link.target = "_blank")) {
        window.location.replace(
          documents.results[0].data.link.url,
          "_blank",
          "noopener=true"
        );
      } else {
        window.location.replace(
          documents.results[0].data.link.url,
          "_self",
          "noopener=true"
        );
      }
    }
    return;
  };

  if (documents?.results_size !== 1) return <></>;
  if (state === "loaded")
    return (
      <Container
        onClick={handleClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={clsx({ invert: isHovered })}
      >
        <div>{documents.results[0].data.text}</div>
      </Container>
    );
};
export default Announcement;
