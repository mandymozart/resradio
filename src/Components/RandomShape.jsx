import { useEffect, useState } from "react";
import useMounted from "react-use-mounted";
import Shapes from "../images/shapes/Shapes";


const RandomShape = () => {
  const mounted = useMounted();
  const [randomNumber, setRandomNumber] = useState();
  useEffect(() => {
    if (mounted) setRandomNumber(Math.floor(Math.random() * 62));
  }, [useMounted]);
  return <Shapes shape={randomNumber} />;
};
export default RandomShape;
