import clsx from "clsx";
import dayjs from "dayjs";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import FadeIn from "../../Animations/FadeIn";
import { ItemContainer } from "../Shows/ShowItem";
import TeaserImage from "../TeaserImage/TeaserImage";

const EventItem = ({ event }) => {
  const [isHovered, setHovered] = useState(false);
  
  return (
    <FadeIn>
      <ItemContainer
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Link to={event.url} className={clsx("image", { rotate: isHovered })}>
          <TeaserImage image={event.data.image} />
        </Link>
        <div className="meta">
          <Link to={event.url}>
            <h4>{event.data.title}</h4>
          </Link>

          {event.data.body.length > 0 && (
            <>
              {event.data.body.map((timeslots, index) => (
                <span key={index}>
                  w/{" "}
                  {timeslots.items.map((timeslot, index) => {
                    return (
                      <span key={index}>
                        <Link to={timeslot.relatedshow.url}>
                          {timeslot.relatedshow.slug},
                        </Link>{" "}
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
