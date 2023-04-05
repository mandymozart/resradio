import React from "react";
import placeholderHero from "../../images/placeholder-hero.png";
import Image from "./Image";

const ThumbnailPanoramaImage = ({ image, ...props }) => {
  return (<Image
    src={image?.url}
    alt={image?.alt}
    placeholderUrl={placeholderHero}
    {...props}
  />);
};

export default ThumbnailPanoramaImage;
