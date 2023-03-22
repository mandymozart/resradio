import styled from "@emotion/styled";
import React from "react";

const Image = styled.img`
  width: 100%;
`;

const ThumbnailPanoramaImage = ({ image, ...props }) => {
  return (
    <Image
      src={image.url}
      alt={image.alt}
      {...props}
    />
  );
};

export default ThumbnailPanoramaImage;
