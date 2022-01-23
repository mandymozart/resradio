import styled from "@emotion/styled";
import React from "react";

const Image = styled.img`
  width: 100%;
  filter: blur(0);
  transition: filter 1s cubic-bezier(1,0,0,1);
`;

const TeaserImage = ({image, ...props }) => {
  return (
    <Image
      src={image.url}
      alt={image.alt}
      {...props}
    />
  );
};

export default TeaserImage;
