import styled from "@emotion/styled";
import { useScrollPosition } from "@n8tb1t/use-scroll-position";
import React, { useEffect, useState } from "react";
import { BrowserView } from "react-device-detect";
import useThemeStore from "../../Stores/ThemeStore";

const getRandomNumber = (min, max) => {
  return Math.random() * (max - min) + min;
};

const OFFSET = 200; // pixel offset of images from border
const DEATHZONE = 512; // pixel in center to not enter for images
const DRIFT = 30;

const placeholderImage =
  "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";

const floatingPointRange = (value, max) => (value * 2) / max - 1;

const Image = styled.img(
  ({ pos, scale, opacity, shift, blur, scroll, windowWidth, windowHeight }) => `
  position: fixed;
  top: 50px;
  width: ${OFFSET}px;
  transform-origin: center - ${OFFSET / 2}px;
  transition: all 0.5s cubic-bezier(1,0,0,1);
  transform: translateX(${
    (pos.left - (OFFSET / DRIFT) * floatingPointRange(shift.x, windowWidth)) *
    scale
  }px) 
  translateY(${
    (pos.top +
      (OFFSET / DRIFT) * floatingPointRange(shift.y * scroll, windowHeight)) *
    scale
  }px) scale(${scale});
  transition: transform .7s ease;
  opacity: ${opacity};
  filter: blur(${blur});
  pointer-events: visible;
`
);

const RandomImage = ({ scale = 1, opacity = 1, blur = 1 }) => {
  const keyword = useThemeStore((store) => store.keyword);
  const mousePosition = useThemeStore((store) => store.mousePosition);
  const [gif, setGif] = useState();
  const [pos, setPos] = useState({ top: 0, left: 0 });

  const windowHeight = window.innerHeight;
  const windowWidth = window.innerWidth;

  const getRandomHorizontalPosition = () => {
    const left = getRandomNumber(
      OFFSET / 2,
      windowWidth / 2 - DEATHZONE / 2 - OFFSET / 2
    );
    const right = getRandomNumber(
      windowWidth / 2 + DEATHZONE / 2,
      windowWidth - OFFSET / 2
    );
    return Math.random() < 0.5 ? left : right;
  };

  const [scrollFloatingPoint, setScrollFloatingPoint] = useState(-1);

  const documentHeight = () =>
    Math.max(
      document.documentElement.clientHeight,
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight
    );

  useScrollPosition(
    ({ prevPos, currPos }) => {
      const value = floatingPointRange(currPos, documentHeight());
      setScrollFloatingPoint(value ? value : -1);
    },
    [scrollFloatingPoint]
  );

  const setNewPosition = () => {
    setPos({
      top: getRandomNumber(50, windowHeight - OFFSET),
      left: getRandomHorizontalPosition(),
    });
  };

  useEffect(() => {
    fetch(
      `https://api.giphy.com/v1/gifs/random?rating=g&api_key=wWRjLNS6tiCZt1fiyaMz9VrRwHsfIUNB&tag=${keyword}`
    )
      .then((response) => response.json())
      .then((data) => {
        setGif(data.data.images.fixed_height_downsampled.url);
      })
      .catch((error) => console.warn("giphy api exceeded rate limit"));
    setNewPosition();
  }, [setGif, keyword]);

  return (
    <BrowserView>
      <Image
        src={gif ? gif : placeholderImage}
        scale={gif ? scale : 0}
        pos={pos}
        shift={{ x: mousePosition.x, y: mousePosition.y }}
        scroll={scrollFloatingPoint}
        blur={blur}
        windowWidth={windowWidth}
        windowHeight={windowHeight}
        opacity={gif ? opacity : 0}
        alt="WHY WHY WHY"
      />
    </BrowserView>
  );
};

export default RandomImage;
