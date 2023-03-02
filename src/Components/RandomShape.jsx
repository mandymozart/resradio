import { useEffect, useState } from "react";
import useMounted from "react-use-mounted";
import Shapes from "../images/shapes/Shapes";

export const getRandomNumber = (min, max) => {
  return Math.random() * (max - min) + min;
};

export const OFFSET = 200; // pixel offset of images from border
export const DEATHZONE = 512; // pixel in center to not enter for images
export const DRIFT = 8;

export const floatingPointRange = (value, max) => (value * 2) / max - 1;

const RandomShape = () => {
  const mounted = useMounted();
  const [randomNumber, setRandomNumber] = useState();
  useEffect(() => {
    if (mounted) setRandomNumber(Math.floor(Math.random() * 62));
  }, [useMounted]);
  return <Shapes shape={randomNumber} />;
};
export default RandomShape;
