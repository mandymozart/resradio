import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import clsx from "clsx";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GetAnnouncement } from "../../Queries/announcement";
import { BREAKPOINT_XS } from "../../config";
import KeyFieldParagraph from "../KeyFieldParagraph";
import SectionLoader from "../SectionLoader";

const Container = styled.div`
  cursor: pointer;
  height: 100%;
  border-radius: 1.5rem;
  display: flex;
  background-color: var(--second);
  color: var(--background);
  flex-direction: column;
  position: relative;
  align-items: center;
  text-align: center;
  justify-content: center;
  font-family: var(--font-bold);
  .content {
    padding: 2rem;
    @media (max-width: ${BREAKPOINT_XS}px) {
      padding: 1rem;
    }
  }
  &.hover {
    color: var(--yellow);
  }
  h4 {
    margin-top: 0;
    @media (max-width: ${BREAKPOINT_XS}px) {
      margin-top: 0;
    }
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
      default:
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
      <div className="content">

        <h4>Announcement</h4>

        <KeyFieldParagraph text={announcement.text} />
      </div>
    </Container>
  );
};
export default Announcement;
