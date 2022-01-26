import styled from "@emotion/styled";
import React, { useState } from "react";
import plastic1 from "../../images/plastic/plastic-1.png";
import plastic10 from "../../images/plastic/plastic-10.png";
import plastic2 from "../../images/plastic/plastic-2.png";
import plastic3 from "../../images/plastic/plastic-3.png";
import plastic4 from "../../images/plastic/plastic-4.png";
import plastic5 from "../../images/plastic/plastic-5.png";
import plastic6 from "../../images/plastic/plastic-6.png";
import plastic7 from "../../images/plastic/plastic-7.png";
import plastic8 from "../../images/plastic/plastic-8.png";
import plastic9 from "../../images/plastic/plastic-9.png";
import useThemeStore from "../../Stores/ThemeStore";

const Container = styled.div`
  img {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1;
    object-fit: cover;
    opacity: 0.3;
    /* filter: blur(0.2rem); */
    pointer-events: none;
  }
`;

const images = [
  plastic1,
  plastic2,
  plastic3,
  plastic4,
  plastic5,
  plastic6,
  plastic7,
  plastic8,
  plastic9,
  plastic10,
];

const PlasticWrap = () => {
  const keyword = useThemeStore((store) => store.keyword);
  const [image, setImage] = useState();
  return (
    <Container>
      <img src={images[Math.floor(Math.random() * images.length)]} alt="Plastic" />
    </Container>
  );
};

export default PlasticWrap;
