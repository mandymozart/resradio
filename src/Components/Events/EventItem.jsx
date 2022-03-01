import { PrismicLink } from "@prismicio/react";
import clsx from "clsx";
import dayjs from "dayjs";
import React, { useState } from "react";
import FadeIn from "../../Animations/FadeIn";
import { ItemContainer } from "../ItemContainer";
import TeaserImage from "../TeaserImage/TeaserImage";


const EventItem = ({ event }) => {
  const [isHovered, setHovered] = useState(false);
  console.log(event)
  return (
    <FadeIn>
      <ItemContainer
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <PrismicLink field={event} className={clsx("image", { rotate: isHovered })}>
          <TeaserImage image={event.data.image} />
        </PrismicLink>
        <div className="meta">
          <PrismicLink field={event}>
            <h4>{event.data.title}</h4>
          </PrismicLink>

          {event.data.body.length > 0 && (
            <>
              {event.data.body.map((timeslots, index) => (
                <span key={index}>
                  w/{" "}
                  {timeslots.items.map((timeslot, index) => {
                    console.log(timeslot)
                    return (
                      <span key={index}>
                        <PrismicLink to={timeslot.relatedshow.url}>
                          {timeslot.relatedshow.title},
                        </PrismicLink>{" "}
                      </span>
                    );
                  })}
                  <br />
                </span>
              ))}
            </>
          )}
          <p>{dayjs(event.data.begin).format("ddd, MMM D, YYYY h:mm A")} </p>
        </div>
      </ItemContainer>
    </FadeIn>
  );
};
export default EventItem;
