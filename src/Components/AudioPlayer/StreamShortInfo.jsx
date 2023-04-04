import styled from "@emotion/styled";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import utc from "dayjs/plugin/utc";
import { loader } from 'graphql.macro';
import React, { useEffect } from "react";
import { client } from "../../prismic";
import useBroadcastStore from "../../Stores/BroadcastStore";
dayjs.extend(isBetween);
dayjs.extend(utc);

const Container = styled.div`
 flex: 1;
`;

const query = loader("./../../Queries/BroadcastsNow.gql")


const StreamShortInfo = () => {
  const { setNextBroadcast, currentBroadcast, setCurrentBroadcast } =
    useBroadcastStore();

  const isLive = (begin, end) => {
    return dayjs().isBetween(dayjs(begin), dayjs(end));
    // return true;
  };

  // Fetch the Prismic initial Prismic content on page load
  useEffect(() => {
    console.log(query)
    const fetchPrismicContent = async () => {
      client
        .query({ query: query, variables: { nowish: dayjs().subtract(1, 'hour') }, fetchPolicy: 'no-cache' })
        .then((data) => {
          let current = undefined;
          let next = undefined;
          if (data.results_size > 0) {
            // set all
            current = data.results.find((b) =>
              isLive(b.data.begin, b.data.end)
            );
            next = data.results.find((b) =>
              dayjs().isBefore(b.data.begin)
            );

            // is Now ?
          } else {
            console.log("no broadcasts fetched");
          }
          console.log(current, next)
          setCurrentBroadcast(current);
          setNextBroadcast(next);

        });
    };
    fetchPrismicContent();
    const intervalId = setInterval(() => fetchPrismicContent(), 60 * 1000);
    return () => clearInterval(intervalId);
  }, [setCurrentBroadcast, setNextBroadcast, currentBroadcast]);

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
