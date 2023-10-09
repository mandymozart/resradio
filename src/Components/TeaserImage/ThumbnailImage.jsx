import React from "react";
import placeholderThumbnail from "../../images/placeholder-thumbnail-grey.png";
import Image from "./Image";

const ThumbnailImage = ({ image, ...props }) => {
  return (<Image src={image?.url} placeholderUrl={placeholderThumbnail} alt={image?.alt} {...props} />);
};

export default ThumbnailImage;
