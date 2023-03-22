import styled from "@emotion/styled";
import * as prismic from "@prismicio/client";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import utc from "dayjs/plugin/utc";
import React, { useEffect, useState } from "react";
import { client } from "../../prismic";
import useBroadcastStore from "../../Stores/BroadcastStore";
dayjs.extend(isBetween);
dayjs.extend(utc);

const Container = styled.div`
 flex: 1;
`;

const StreamShortInfo = () => {
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

        }, {
          fetchLinks: "hostedby.title",
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
      {currentBroadcast ? (<>
        {isLive(currentBroadcast.data.begin, currentBroadcast.data.end) && "Live"}
        {currentBroadcast.data.hostedby.uid} &mdash; {currentBroadcast.data.title}
      </>
      ) : (
        <>
          Heavy Rotation from our archive
        </>
      )}
    </Container>
  );
};

export default StreamShortInfo;
