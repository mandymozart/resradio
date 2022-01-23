import styled from "@emotion/styled";
import clsx from "clsx";
import dayjs from "dayjs";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import FadeIn from "../../Animations/FadeIn";
import TeaserImage from "../TeaserImage/TeaserImage";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
  line-height: 1.1rem;
  margin-bottom: 2rem;
  gap: 3rem;
  @media only screen and (max-width: 600px) {
      gap: 1rem;
  }

  .image {
    flex: 0 0 10rem;
    @media only screen and (max-width: 600px) {
        flex: 0 0 7rem; 
    }
    &:hover {
        transition: all 0.4s ease-in-out;
    }
  }
  .meta {
    h3 {
      font-size: 1.1rem;
      margin: 0;
    }
    span {
      font-size: 1.1rem;
      line-height: 1.1rem;
    }
  }
`;

const EventItem = ({ event }) => {
  const [isHovered, setHovered] = useState(false);
  console.log(event.data.image);

  return (
    <FadeIn>
      <Container
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Link to={event.url} className={clsx("image", { rotate: isHovered })}>
          <TeaserImage image={event.data.image} />
        </Link>
        <div className="meta">
          <Link to={event.url}>
            <h3>{event.data.title}</h3>
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
      </Container>
    </FadeIn>
  );
};
export default EventItem;
