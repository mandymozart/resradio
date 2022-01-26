import styled from "@emotion/styled";
import shape1 from "../images/shapes/shape-1.svg";
import shape11 from "../images/shapes/shape-11.svg";
import shape12 from "../images/shapes/shape-12.svg";
import shape13 from "../images/shapes/shape-13.svg";
import shape14 from "../images/shapes/shape-14.svg";
import shape15 from "../images/shapes/shape-15.svg";
import shape16 from "../images/shapes/shape-16.svg";
import shape17 from "../images/shapes/shape-17.svg";
import shape18 from "../images/shapes/shape-18.svg";
import shape19 from "../images/shapes/shape-19.svg";
import shape2 from "../images/shapes/shape-2.svg";
import shape20 from "../images/shapes/shape-20.svg";
import shape21 from "../images/shapes/shape-21.svg";
import shape22 from "../images/shapes/shape-22.svg";
import shape23 from "../images/shapes/shape-23.svg";
import shape24 from "../images/shapes/shape-24.svg";
import shape25 from "../images/shapes/shape-25.svg";
import shape26 from "../images/shapes/shape-26.svg";
import shape27 from "../images/shapes/shape-27.svg";
import shape28 from "../images/shapes/shape-28.svg";
import shape29 from "../images/shapes/shape-29.svg";
import shape3 from "../images/shapes/shape-3.svg";
import shape30 from "../images/shapes/shape-30.svg";
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
  shape12,
  shape13,
  shape14,
  shape15,
  shape16,
  shape17,
  shape18,
  shape19,
  shape20,
  shape21,
  shape22,
  shape23,
  shape24,
  shape25,
  shape26,
  shape27,
  shape28,
  shape29,
  shape30,
];
const Container = styled.p`
  text-align: center;
  img {
    margin: 3rem auto;
    width: 10rem;
  }
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
