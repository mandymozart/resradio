import styled from "@emotion/styled";
import React from "react";
import shape1 from "../images/shapes/shape-1.svg";
import shape11 from "../images/shapes/shape-11.svg";
import shape2 from "../images/shapes/shape-2.svg";
import shape3 from "../images/shapes/shape-3.svg";
import shape4 from "../images/shapes/shape-4.svg";
import shape5 from "../images/shapes/shape-5.svg";
import shape6 from "../images/shapes/shape-6.svg";
import shape7 from "../images/shapes/shape-7.svg";
import shape8 from "../images/shapes/shape-8.svg";
import shape9 from "../images/shapes/shape-9.svg";
const shapes = [
  shape1,
  shape2,
  shape3,
  shape3,
  shape4,
  shape5,
  shape6,
  shape7,
  shape8,
  shape9,
  shape11,
];
const Container = styled.p`
  color: var(--color);
  text-align: center;
  margin: 3rem 0;
`

const Divider = () => {
  return (
    <Container>
      <img
        src={shapes[Math.floor(Math.random() * shapes.length)]}
        alt="divider"
      />
    </Container>
  );
};
export default Divider;
