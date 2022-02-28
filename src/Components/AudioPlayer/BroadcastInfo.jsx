import styled from "@emotion/styled";
import * as prismic from "@prismicio/client";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import React, { useEffect, useState } from "react";
import { BrowserView } from "react-device-detect";
import Marquee from "react-fast-marquee";
import { Link } from "react-router-dom";
import useBroadcastStore from "../../Stores/BroadcastStore";
import { client } from "./../../prismic";
dayjs.extend(isBetween);

const Container = styled.div`
  margin-left: 1rem;
  line-height: 1rem;
  text-align: center;
  > div {
    display: inline-flex;
    text-transform: capitalize;
  }
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
      {broadcasts && (<>
        <Marquee>
          {broadcasts.map(broadcast => (
            <>
            <Link to={currentBroadcast.url}>{dayjs(broadcast.data.begin).format("HH:mm")} - {dayjs(broadcast.data.end).format("HH:mm")}: {currentBroadcast.data.title} by {currentBroadcast.data.hostedby.slug}</Link>
            </>
          ))}
        </Marquee>
      </>)}
      {currentBroadcast ? (
        <>
          <Link to={currentBroadcast.url}>{currentBroadcast.data.title}</Link>
          <BrowserView>
            &nbsp; &mdash; &nbsp;{" "}
            <Link to={currentBroadcast.data.hostedby.url}>
              <Marquee>
                {currentBroadcast.data.hostedby.slug}
                </Marquee>
            </Link>
          </BrowserView>
          
        </>
      ) : (
        <>{notFound ? "Offline" : "..."}</>
      )}
    </Container>
  );
};

export default BroadcastInfo;
