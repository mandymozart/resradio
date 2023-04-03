import * as prismic from "@prismicio/client";
import React, { useEffect, useState } from "react";
import BroadcastItemTextOnly from "../Components/Broadcasts/BroadcastItemTextOnly";
import HeaderOffset from "../Components/HeaderOffset";
import Loader from "../Components/Loader";
import { client } from "../prismic";

const RotationPage = () => {

  const [broadcasts, setBroadcasts] = useState(null);

  useEffect(() => {
    const fetchPrismicContent = async () => {
      client
        .getByType("playlist", {
          predicates: [
            prismic.predicate.at(
              "my.playlist.uid",
              "rotation"
            ),
          ],
        })
        .then((document) => {
          let all = undefined;
          if (document.results_size > 0) {
            // set all
            all = document.results[0].data.broadcasts;
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
    <HeaderOffset>
      <h2>Heavy Rotation</h2>
      Tracks in Playlist:
      {!broadcasts ? (<Loader />) : (<>
        {broadcasts.map((item) => <BroadcastItemTextOnly uid={item.broadcast.uid} />)}
      </>)}
    </HeaderOffset>
  );
};

export default RotationPage;
