import styled from "@emotion/styled";
import { PrismicLink } from "@prismicio/react";
import clsx from "clsx";
import dayjs from "dayjs";
import React, { useState } from "react";
import FadeIn from "../../Animations/FadeIn";
import { ItemContainer } from "../ItemContainer";
import TeaserImage from "../TeaserImage/TeaserImage";

const Hosts = styled.div`
  span {
    text-transform: capitalize;
  }
`;

const EventItem = ({ event }) => {
  const [isHovered, setHovered] = useState(false);
  return (
    <FadeIn>
      <ItemContainer
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <PrismicLink
          field={event}
          className={clsx("image", { rotate: isHovered })}
        >
          <TeaserImage image={event.data.image} />
        </PrismicLink>
        <div className="meta">
          <PrismicLink field={event}>
            <h4>{event.data.title}</h4>
          </PrismicLink>

          {event.data.body.length > 0 && (
            <Hosts>
              {event.data.body.map((timeslots, index) => (
                <span key={index}>
                  w/{" "}
                  {timeslots.items.map((timeslot, index) => {
                    console.log(timeslot.relatedshow.slug, index);
                    return (
                      <span key={index}>
                        <PrismicLink field={timeslot.relatedshow}>
                          {timeslot.relatedshow.uid},
                        </PrismicLink>{" "}
                      </span>
                    );
                  })}
                  <br />
                </span>
              ))}
            </Hosts>
          )}
          <p>{dayjs(event.data.begin).format("MMM D, h:mm A")} </p>
        </div>
      </ItemContainer>
    </FadeIn>
  );
};
export default EventItem;
