import React from "react";
import placeholderHero from "../../images/placeholder-hero-grey.png";
import Image from "./Image";


const HeroImage = ({ image, ...props }) => {
  return (<Image src={image?.url} placeholderUrl={placeholderHero} alt={image?.alt} {...props} />);
};

export default HeroImage;
