import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import clsx from "clsx";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GetAnnouncement } from "../../Queries/announcement";
import PageLoader from "../PageLoader";

const Container = styled.div`
  cursor: pointer;
  padding: 1.5rem;
  background: var(--grey);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  div {
    font-size: 1.5rem;
    font-family: var(--font-bold);
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

  if (loading) return <PageLoader />;
  if (error) return <>Error : {error.message}</>;
  if (data.allAnnouncements.edges.length <= 0) return <></>
  console.log(data.allAnnouncements.edges)
  const announcement = data.allAnnouncements.edges[0].node;
  return (
    <Container
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={clsx({ invert: isHovered })}
    >
      <div>{announcement.text}</div>
    </Container>
  );
};
export default Announcement;
