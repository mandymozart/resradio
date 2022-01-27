import clsx from "clsx";
import dayjs from "dayjs";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import FadeIn from "../../Animations/FadeIn";
import { ItemContainer } from "../ItemContainer";
import TeaserImage from "../TeaserImage/TeaserImage";

const BroadcastItem = ({ broadcast }) => {
  const [isHovered, setHovered] = useState(false);

  return (
    <FadeIn>
      <ItemContainer
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Link
          to={broadcast.url}
          className={clsx("image", { rotate: isHovered })}
        >
          <TeaserImage image={broadcast.data.image} />
        </Link>
        <div className="meta">
          <Link to={broadcast.url}>
            <h4>{broadcast.data.title}</h4>
          </Link>

          <Link to={broadcast.data.hostedby.url}>
            {broadcast.data.hostedby.slug}
          </Link>

          <p>
            {dayjs(broadcast.data.begin).format("ddd, MMM D, YYYY HH:mm")}{" "}
          </p>
        </div>
      </ItemContainer>
    </FadeIn>
  );
};
export default BroadcastItem;
