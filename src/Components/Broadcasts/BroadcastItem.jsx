import { PrismicLink } from "@prismicio/react";
import clsx from "clsx";
import dayjs from "dayjs";
import React, { useState } from "react";
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
        <PrismicLink
          field={broadcast}
          className={clsx("image", { rotate: isHovered })}
        >
          <TeaserImage image={broadcast.data.image} />
        </PrismicLink>
        <div className="meta">
          <PrismicLink field={broadcast}>
            <h4>{broadcast.data.title}</h4>
          </PrismicLink>

          <PrismicLink field={broadcast.data.hostedby}>
            {broadcast.data.hostedby.title}
          </PrismicLink>

          <p>
            {dayjs(broadcast.data.begin).format("ddd, MMM D, YYYY HH:mm")}{" "}
          </p>
        </div>
      </ItemContainer>
    </FadeIn>
  );
};
export default BroadcastItem;
