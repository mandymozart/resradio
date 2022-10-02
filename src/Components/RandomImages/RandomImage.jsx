import styled from "@emotion/styled";
import React, { useEffect, useState } from "react";
import { BrowserView } from "react-device-detect";
import useThemeStore from "../../Stores/ThemeStore";

export const getRandomNumber = (min, max) => {
  return Math.random() * (max - min) + min;
};

export const OFFSET = 200; // pixel offset of images from border
export const DEATHZONE = 512; // pixel in center to not enter for images
export const DRIFT = 8;

const placeholderImage =
  "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";

export const floatingPointRange = (value, max) => (value * 2) / max - 1;

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

export const documentHeight = () =>
  Math.max(
    document.documentElement.clientHeight,
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight
  );

export const getRandomHorizontalPosition = () => {
  const windowWidth = window.innerWidth;
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
const RandomImage = ({ scale = 1, opacity = 1, blur = 1 }) => {
  const keyword = useThemeStore((store) => store.keyword);
  const mousePosition = useThemeStore((store) => store.mousePosition);
  const [gif, setGif] = useState();
  const [pos, setPos] = useState({ top: 0, left: 0 });

  const setNewPosition = () => {
    setPos({
      top: getRandomNumber(50, window.innerHeight - OFFSET),
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
        scroll={-1}
        blur={blur}
        windowWidth={window.innerWidth}
        windowHeight={window.innerHeight}
        opacity={gif ? opacity : 0}
        alt="WHY WHY WHY"
      />
    </BrowserView>
  );
};

export default RandomImage;
