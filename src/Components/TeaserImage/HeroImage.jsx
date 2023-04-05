import React from "react";
import placeholderHero from "../../images/placeholder-hero.png";
import Image from "./Image";


const HeroImage = ({ image }) => {
  return (<Image src={image.url} placeholderUrl={placeholderHero} alt={image.alt} />);
};

export default HeroImage;
