import styled from "@emotion/styled";
import { usePrismicDocumentsByType } from "@prismicio/react";
import React, { useEffect, useState } from "react";
import useFilterStore from "../../Stores/FilterStore";
import { shuffle } from "../../utils";
import RecentShowItem from "./RecentShowItem";

const Container = styled.div`
  h3 {
    padding: 1rem 1rem 0.5rem 2rem;
    margin: 0 !important;
    &:first-of-type {
      border-right: 2px solid var(--color);
    }
    
  }
  .list {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
`;

const RecentShowList = () => {
  const { moods, tempos, genres } = useFilterStore();
  // TODO get shows which recently broadcasted
  const [documents] = usePrismicDocumentsByType("shows", {
    pageSize: 2,
  });
  const [shows, setShows] = useState();
  const [q, setQ] = useState("");

  useEffect(() => {
    if (documents) {
      setShows(shuffle(documents.results));
      console.log(documents)
    }
  }, [shows, documents]);
  if (!documents && !shows) return <></>;
  return (
    <Container>
      <div className="list">
        <h3>Recent Shows </h3><h3></h3>
        {shows
          ?.filter(
            (show) =>
              show.data.title.toString().toLowerCase().indexOf(q.toLowerCase()) >
              -1
          )
          .map((show) => (
            <RecentShowItem key={show.id} show={show} />
          ))}
      </div>
    </Container>
  );
};
export default RecentShowList;
