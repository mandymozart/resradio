import styled from "@emotion/styled";
import * as prismic from "@prismicio/client";
import { PrismicLink } from "@prismicio/react";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import React, { useEffect, useState } from "react";
import { BrowserView } from "react-device-detect";
import Marquee from "react-double-marquee";
import useBroadcastStore from "../../Stores/BroadcastStore";
import { client } from "./../../prismic";
dayjs.extend(isBetween);

const Container = styled.div`
  margin-left: 1rem;
  line-height: 1rem;
  text-align: center;
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
`;

const BroadcastInfo = () => {
  const { broadcasts, setBroadcasts, currentBroadcast, setCurrentBroadcast } =
    useBroadcastStore();

  const [notFound, toggleNotFound] = useState(false);

  const isLive = (begin, end) => {
    console.log(begin, dayjs().format(), end);
    return dayjs().isBetween(dayjs(begin), dayjs(end));
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

            // find current
            data.results
              .slice(
                0,
                data.results.findIndex((b) => isLive(b.data.begin, b.data.end))
              )
              .forEach((b) => {
                current = b;
                console.log(b.data);
              });

            // is Now ?
          } else {
            console.log("no broadcasts fetched");
          }
          console.log(current);
          console.log(all);
          setBroadcasts(all);
          setCurrentBroadcast(current);
          if (!current) toggleNotFound(true);
        });
    };
    fetchPrismicContent();
  }, []);

  return (
    <Container>
      {broadcasts && (
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
      )}
      {currentBroadcast ? (
        <>
          <PrismicLink to={currentBroadcast.url}>{currentBroadcast.data.title}</PrismicLink>
          <BrowserView>
            &nbsp; &mdash; &nbsp;{" "}
            <PrismicLink to={currentBroadcast.data.hostedby.url}>
              <Marquee>{currentBroadcast.data.hostedby.slug}</Marquee>
            </PrismicLink>
          </BrowserView>
        </>
      ) : (
        <>
          {notFound
            ? ""
            : "..."}
        </>
      )}
    </Container>
  );
};

export default BroadcastInfo;
