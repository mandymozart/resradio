import clsx from "clsx";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import FadeIn from "../../Animations/FadeIn";
import { ItemContainer } from "../ItemContainer";
import TeaserImage from "../TeaserImage/TeaserImage";

const ShowItem = ({ show }) => {
  const [isHovered, setHovered] = useState(false);

  return (
    <FadeIn>
      <ItemContainer
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Link to={show.url} className={clsx("image", { rotate: isHovered })}>
          <TeaserImage image={show.data.image} />
        </Link>
        <div className="meta">
          <Link key={show.id} to={show.url}>
            <h4>{show.data.title}</h4>
          </Link>
        </div>
      </ItemContainer>
    </FadeIn>
  );
};
export default ShowItem;
