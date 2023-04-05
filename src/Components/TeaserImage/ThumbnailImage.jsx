import React from "react";
import placeholderThumbnail from "../../images/placeholder-thumbnail.png";
import Image from "./Image";

const ThumbnailImage = ({ image, ...props }) => {
  return (<>
    {image ? (
      <Image
        src={image.url}
        alt={image.alt}
        {...props}
      />
    ) : (<Image src={placeholderThumbnail} alt="loading ..." />)}
  </>
  );
};

export default ThumbnailImage;
