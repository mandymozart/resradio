import styled from "@emotion/styled";
import React, { useEffect, useState } from "react";
import { BrowserView } from "react-device-detect";
import useThemeStore from "../../Stores/ThemeStore";

const Layer = styled.div`
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  position: fixed;
  top: 0;
  left: 0;
`;

const getRandomNumber = (min, max) => {
  console.log(max);
  return Math.random() * (max - min) + min;
};

const OFFSET = 50; // pixel offset of images from border
const DEATHZONE = 512; // pixel in center to not enter for images

const Image = styled.img(
  ({ pos, scale, opacity }) => `
  width: ${OFFSET/2};
  transition: all 0.5s cubic-bezier(1,0,0,1);
  transform: translateX(${pos.left}px) translateY(${pos.top}px) scale(${scale});
  transition: transform 0.5s cubic(1,0,0,1);
  opacity: ${opacity};
`
);

const RandomImage = ({ scale = 1, opacity = 1 }) => {
  const keyword = useThemeStore((store) => store.keyword);
  const [gif, setGif] = useState();
  const [pos, setPos] = useState({ top: 0, left: 0 });

  const windowHeight = window.innerHeight;
  const windowWidth = window.innerWidth;

  const getRandomHorizontalPosition = () => {
    let output = 1000;
    while (true) {
      output = getRandomNumber(OFFSET, windowWidth - OFFSET);
      if (output < DEATHZONE + OFFSET || output > OFFSET + DEATHZONE) break;
    }
    console.log(output);
    return output-OFFSET;
  };

  useEffect(() => {
    fetch(
      `https://api.giphy.com/v1/gifs/random?api_key=wWRjLNS6tiCZt1fiyaMz9VrRwHsfIUNB&tag=${keyword}`
    )
      .then((response) => response.json())
      .then((data) => {
        setGif(data.data.images.fixed_height_downsampled.url);
      })
      .catch((error) => console.warn("giphy api exceeded rate limit"));
    setPos({
      top: getRandomNumber(OFFSET, windowHeight - OFFSET),
      left: getRandomHorizontalPosition(),
    });
    console.log(pos);
  }, [setGif, keyword]);
  useEffect(() => {
    console.log(keyword);
  }, [keyword]);
  return (
    <BrowserView>
      <Layer>
        {
          <Image
            src={gif}
            scale={scale}
            pos={pos}
            opacity={opacity}
            alt="gif"
          />
        }
      </Layer>
    </BrowserView>
  );
};

export default RandomImage;
