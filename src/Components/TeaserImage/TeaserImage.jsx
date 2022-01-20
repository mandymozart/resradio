import styled from "@emotion/styled";
import React, { useState } from "react";
import ImageFilter from "react-image-filter/lib/ImageFilter";

const Image = styled(ImageFilter)`
  width: 100%;
  &::before {
    background-color: rgb(240, 14, 46);
    content: "";
    display: block;
    width: 100%;
    height: 100%;
    mix-blend-mode: darken;
    position: absolute;
    top: 0;
    left: 0;
  }
`;

const filterNone = [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0];
const filterDuotone = "duotone";

const TeaserImage = ({image, ...props }) => {
  const [filter, setFilter] = useState("duotone");
  return (
    <Image
      filter={filter}
      colorOne={[37, 26, 249]}
      colorTwo={[255, 0, 98]}
      onMouseEnter={() => setFilter(filterNone)}
      onMouseLeave={() => setFilter(filterDuotone)}
      image={image.url}
      alt={image.alt}
      {...props}
    />
  );
};

export default TeaserImage;
