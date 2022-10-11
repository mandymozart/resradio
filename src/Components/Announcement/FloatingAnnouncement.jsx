import styled from "@emotion/styled";
import { usePrismicDocumentsByType } from "@prismicio/react";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useMounted from "react-use-mounted";
import Shapes from "../../images/shapes/Shapes";
import useThemeStore from "../../Stores/ThemeStore";
import {
  DRIFT, floatingPointRange,
  getRandomNumber
} from "../RandomImages/RandomImage";

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
  transform: translateX(${
    pos.left - (WIDTH / DRIFT) * floatingPointRange(shift.x, windowWidth)
  }px) 
  translateY(${
    pos.top + (WIDTH / DRIFT) * floatingPointRange(shift.y * -1, windowHeight)
  }px);
  transition: transform .7s ease;
  pointer-events: visible;


  cursor: pointer;
  border: 1px solid var(--second);
  border-radius: 0.1rem;
  padding: 1.5rem;
  background: var(--background);
  display: flex;
  flex-direction: row;
  gap: 1.5rem;
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
    font-size: 1.25rem;
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

const shapes = [
  1, 2, 3, 4, 5, 6, 9, 16, 18, 19, 22, 24, 25, 28, 30, 45, 44, 58, 59, 60, 61,
];

const FloatingAnnouncement = () => {
  const [documents, { state }] = usePrismicDocumentsByType("announcement");
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
    if (documents.results[0].data.link.link_type === "Document")
      navigate(documents.results[0].data.link.url);
    if (documents.results[0].data.link.link_type === "Web") {
      if ((documents.results[0].data.link.target = "_blank")) {
        window.open(documents.results[0].data.link.url, "_blank");
      } else {
        window.open(documents.results[0].data.link.url, "_self");
      }
    }
    return;
  };

  useEffect(() => {
    setNewPosition();
  }, [keyword]);

  const mounted = useMounted();
  const [randomNumber, setRandomNumber] = useState(1);
  useEffect(() => {
    if (mounted) {
      setRandomNumber(shapes[Math.floor(Math.random() * shapes.length - 1)]);
      console.log(randomNumber);
    }
  }, [mounted]);

  if (documents?.results_size !== 1) return <></>;
  if (!documents.results[0].data.isactive) return <></>;
  if (!isVisible) return <></>;
  if (state === "loaded")
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
        <Shapes shape={randomNumber} />
        <div onClick={handleClick}>{documents.results[0].data.text}</div>
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
