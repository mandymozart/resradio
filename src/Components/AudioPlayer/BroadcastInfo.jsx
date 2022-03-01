import styled from "@emotion/styled";
import * as prismic from "@prismicio/client";
import { PrismicLink } from "@prismicio/react";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import utc from "dayjs/plugin/utc";
import React, { useEffect, useState } from "react";
import Marquee from "react-double-marquee";
import useBroadcastStore from "../../Stores/BroadcastStore";
import { client } from "./../../prismic";
dayjs.extend(isBetween);
dayjs.extend(utc);

const Container = styled.div`
  margin-left: 1rem;
  line-height: 1rem;
  text-align: center;
  .info {
    width: 300px;
    @media only screen and (max-width: 600px) {
      width: 90px;
    }
    white-space: nowrap;
    overflow: hidden;
    /* > div {
      display: inline-flex; */
    text-transform: capitalize;
    /* } */
  }
`;

const BroadcastInfo = () => {
  const { broadcasts, setBroadcasts, currentBroadcast, setCurrentBroadcast } =
    useBroadcastStore();

  const [notFound, toggleNotFound] = useState(false);

  const isLive = (begin, end) => {
    return dayjs().isBetween(dayjs(begin), dayjs(end));
    // return true;
  };

  // Fetch the Prismic initial Prismic content on page load
  useEffect(() => {
    const fetchPrismicContent = async () => {
      client
        .getByType("broadcasts", {
          predicates: [
            prismic.predicate.dateDayOfMonth(
              "my.broadcasts.begin",
              parseInt(dayjs().format("D"))
            ),
          ],
        })
        .then((data) => {
          let current = undefined;
          let all = undefined;
          if (data.results_size > 0) {
            // set all
            all = data.results;
            current = data.results.find((b) =>
              isLive(b.data.begin, b.data.end)
            );

            // is Now ?
          } else {
            console.log("no broadcasts fetched");
          }
          setBroadcasts(all);
          setCurrentBroadcast(current);
          if (!current) toggleNotFound(true);
        });
    };
    fetchPrismicContent();
    const intervalId = setInterval(() => fetchPrismicContent(), 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <Container>
      {/* {broadcasts && (
        <>
          <Marquee>
            {broadcasts.map((broadcast) => (
              <>
                <PrismicLink field={broadcast}>
                  {dayjs(broadcast.data.begin).format("HH:mm")} -{" "}
                  {dayjs(broadcast.data.end).format("HH:mm")}:{" "}
                  {broadcast.data.title} by{" "}
                  {broadcast.data.hostedby.slug}
                </PrismicLink>
              </>
            ))}
          </Marquee>
        </>
      )} */}
      {currentBroadcast ? (
        <div className="info">
          <Marquee>
            <PrismicLink field={currentBroadcast.data.hostedby}>
              {dayjs(currentBroadcast.data.begin).format("HH:mm")} -{" "}
              {dayjs(currentBroadcast.data.end).format("HH:mm")}:{" "}
              {currentBroadcast.data.hostedby.uid}
            </PrismicLink>
          </Marquee>
        </div>
      ) : (
        <>{notFound ? "" : "..."}</>
      )}
    </Container>
  );
};

export default BroadcastInfo;
