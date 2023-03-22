import styled from "@emotion/styled";
import * as prismic from "@prismicio/client";
import { usePrismicClient } from "@prismicio/react";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import BroadcastList from "../Components/Broadcasts/BroadcastList";
import useThemeStore from "../Stores/ThemeStore";

const Container = styled.section`

`

const Broadcasts = () => {
  const setKeyword = useThemeStore((store) => store.setKeyword);
  const [broadcasts, setBroadcasts] = useState();
  const client = usePrismicClient();
  useEffect(() => {
    const fetchPrismicContent = async () => {
      client
        .getByType("broadcasts", {
          predicates: [
            prismic.predicate.dateBetween(
              "my.broadcasts.begin",
              dayjs().subtract(14, "days").format("YYYY-MM-DD"), dayjs().subtract(7, "days").format("YYYY-MM-DD") // last weeks content
            ),
          ],

        }, {
          fetchLinks: "hostedby.title",
        }, { pageSize: 4 }, { page: 1 })
        .then((data) => {
          let all = undefined;
          if (data.results_size > 0) {
            // set all
            all = data.results;
            // is Now ?
          } else {
            console.log("no broadcasts fetched");
          }
          setBroadcasts(all);
        });
    };
    fetchPrismicContent();
  }, []);
  return (
    <Container>
      <h2>Recent broadcasts</h2>
      <BroadcastList broadcasts={broadcasts} />
    </Container>
  );
};

export default Broadcasts;
