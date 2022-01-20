import styled from "@emotion/styled";
import { enableMapSet } from "immer";
import React, { useEffect, useState } from "react";
import { BrowserView } from "react-device-detect";
import useThemeStore from "../../Stores/ThemeStore";

enableMapSet();

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

const OFFSET = 200; // pixel offset of images from border
const DEATHZONE = 512; // pixel in center to not enter for images

const placeholderImage =
  "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";

const floatingPointRange = (value, max) => (value * 2) / max - 1;

const Image = styled.img(
  ({ pos, scale, opacity, shift, windowWidth, windowHeight }) => `
  width: ${OFFSET}px;
  transform-origin: center;
  transition: all 0.5s cubic-bezier(1,0,0,1);
  transform: translateX(${
    pos.left + OFFSET/4 * scale * floatingPointRange(shift.x, windowWidth)
  }px) translateY(${
    pos.top + OFFSET/4 * scale * floatingPointRange(shift.y, windowHeight)
  }px) scale(${scale});
  transition: transform .1s ease;
  opacity: ${opacity};
`
);

const RandomImage = ({ scale = 1, opacity = 1 }) => {
  const keyword = useThemeStore((store) => store.keyword);
  const mousePosition = useThemeStore((store) => store.mousePosition);
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
    return output - OFFSET;
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
    setPos({
      top: getRandomNumber(OFFSET, windowHeight - OFFSET),
      left: getRandomHorizontalPosition(),
    });
  }, [setGif, keyword]);

  // useEffect(() => {
  //   // console.log(mousePosition);
  //   setPos(
  //     produce((draft) => {
  //       draft.left = draft.left * mousePosition.x / windowWidth;
  //       console.log(draft)
  //       draft.top = draft.top * mousePosition.y / windowHeight;
  //       console.log(draft.top,draft.left,mousePosition.y / windowHeight)
  //     })
  //   );
  // }, [mousePosition, setPos]);
  return (
    <BrowserView>
      <Layer>
        {
          <Image
            src={gif ? gif : placeholderImage}
            scale={gif ? scale : 0}
            pos={pos}
            shift={{ x: mousePosition.x, y: mousePosition.y }}
            windowWidth={windowWidth}
            windowHeight={windowHeight}
            opacity={gif ? opacity : 0}
            alt="WHY WHY WHY"
          />
        }
      </Layer>
    </BrowserView>
  );
};

export default RandomImage;
