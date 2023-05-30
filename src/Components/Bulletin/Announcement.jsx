import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import clsx from "clsx";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GetAnnouncement } from "../../Queries/announcement";
import KeyFieldParagraph from "../KeyFieldParagraph";
import SectionLoader from "../SectionLoader";

const Container = styled.div`
  cursor: pointer;
  height: 100%;
  border-radius: 1.5rem;
  padding: 2rem;
  display: flex;
  background-color: var(--second);
  color: var(--background);
  flex-direction: column;
  position: relative;
  align-items: center;
  text-align: center;
  justify-content: center;
  font-family: var(--font-bold);
  &.hover {
    color: var(--yellow);
  }
`;

const Announcement = () => {

  const { loading, error, data } = useQuery(GetAnnouncement);

  const navigate = useNavigate();
  const [isHovered, setHovered] = useState(false);

  const handleClick = () => {
    switch (announcement.link._linkType) {
      case "Link.web":
        if ((announcement.link.target = "_blank")) {
          window.location.replace(
            announcement.link.url,
            "_blank",
            "noopener=true"
          );
        } else {
          window.location.replace(
            announcement.link.url,
            "_self",
            "noopener=true"
          );
        }
        break;
      case "Link.document":
        navigate(announcement.link.url);
        break;
    }
    return;
  };

  if (loading) return <SectionLoader />;
  if (error) return <>Error : {error.message}</>;
  if (data.allAnnouncements.edges.length <= 0) return <></>
  const announcement = data.allAnnouncements.edges[0].node;
  return (
    <Container
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={clsx({ hover: isHovered })}
    >
      <h4>Announcement</h4>

      <KeyFieldParagraph text={announcement.text} />
    </Container>
  );
};
export default Announcement;
