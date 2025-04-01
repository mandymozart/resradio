import React from "react";
import placeholder from "../../images/placeholder-panorama-thumbnail-grey.png";
import Image from "./Image";

const ThumbnailPanoramaImage = ({ image, ...props }) => {
  return (<Image
    src={image?.url}
    alt={image?.alt}
    placeholderUrl={placeholder}
    {...props}
  />);
};

export default ThumbnailPanoramaImage;
