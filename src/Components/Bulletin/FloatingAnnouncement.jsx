import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GetAnnouncement } from "../../Queries/announcement";
import useThemeStore from "../../Stores/ThemeStore";
import PageLoader from "../PageLoader";

const getRandomNumber = (min, max) => {
  return Math.random() * (max - min) + min;
};

const OFFSET = 200; // pixel offset of images from border
const DEATHZONE = 512; // pixel in center to not enter for images
const DRIFT = 8;

const floatingPointRange = (value, max) => (value * 2) / max - 1;

// WIDTH
const WIDTH = 500;
const HEIGHT = 200;
const Container = styled.div(
  ({ pos, shift, windowWidth, windowHeight }) => `
  position: fixed;
  top: 150px;
  width: ${WIDTH}px;
  transform-origin: center - ${WIDTH / 2}px;
  transition: all 0.5s cubic-bezier(1,0,0,1);
  transform: translateX(${pos.left - (WIDTH / DRIFT) * floatingPointRange(shift.x, windowWidth)
    }px) 
  translateY(${pos.top + (WIDTH / DRIFT) * floatingPointRange(shift.y * -1, windowHeight)
    }px);
  transition: transform .7s ease;
  pointer-events: visible;


  cursor: pointer;
  padding: 3rem;
  background: var(--grey);
  display: flex;
  flex-direction: row;
  text-align: center;
  color: var(--second);

  .close {
    position: absolute;
    top: 1.5rem;
    right: 1.5rem;
    &:hover {
      color: red;
    }
  }
  div {
    color: var(--second);
    font-size: 1.5rem;
    font-family: var(--font-bold);
    text-transform: uppercase;
    text-align: left;
  }
  &.invert {
    background: var(--second);
    div,
    svg {
      color: var(--background);
    }
  }
`
);

const FloatingAnnouncement = () => {
  const { loading, error, data } = useQuery(GetAnnouncement);

  const navigate = useNavigate();
  const [isHovered, setHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const keyword = useThemeStore((store) => store.keyword);
  const mousePosition = useThemeStore((store) => store.mousePosition);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  const setNewPosition = () => {
    setPos({
      top: getRandomNumber(50, window.innerHeight - HEIGHT),
      left: getRandomNumber(WIDTH / 2, window.innerWidth - WIDTH / 2),
    });
  };

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

  useEffect(() => {
    setNewPosition();
  }, [keyword]);

  if (loading) return <PageLoader />;
  if (error) return <>Error : {error.message}</>;
  if (data.allAnnouncements.edges.length <= 0) return <></>
  const announcement = data.allAnnouncements.edges[0].node;
  if (!isVisible) return <></>;
  return (
    <Container
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={clsx({ invert: isHovered })}
      pos={pos}
      shift={{ x: mousePosition.x, y: mousePosition.y }}
      windowWidth={window.innerWidth}
      windowHeight={window.innerHeight}
    >
      <div onClick={handleClick}>{announcement.text}</div>
      <span className="close" onClick={() => setIsVisible(false)}>
        <svg
          width="2rem"
          height="2rem"
          version="1.1"
          viewBox="0 0 700 700"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g>
            <path
              fill="currentColor"
              d="m350 271.6 126-126 8.3984 8.3984-126 126 126 126-8.3984 8.3984-126-126-126 126-8.3984-8.3984 126-126-126-126 8.3984-8.3984z"
              fillRule="evenodd"
            />
            <path
              d="m350 271.6 126-126 8.3984 8.3984-126 126 126 126-8.3984 8.3984-126-126-126 126-8.3984-8.3984 126-126-126-126 8.3984-8.3984z"
              fill="currentColor"
              fillRule="evenodd"
            />
          </g>
        </svg>
      </span>
    </Container>
  );
};
export default FloatingAnnouncement;
