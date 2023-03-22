import styled from "@emotion/styled";
import React from "react";

const Container = styled.div`
  img { width: 100%; }
`;

const HeroImage = ({ image }) => {
  return (
    <Container>
      {image ? (
        <img
          src={image.url}
          alt={image.alt}
        />
      ) : (<img src="https://placehold.it/1920x1080" alt="loading" />)}
    </Container>
  );
};

export default HeroImage;
