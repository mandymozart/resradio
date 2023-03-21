import styled from "@emotion/styled";
import { usePrismicDocumentsByType } from "@prismicio/react";
import React, { useEffect, useState } from "react";
import { shuffle } from "../../utils";
import ShowItem from "./ShowItem";

const Container = styled.div`
  input {
    background: transparent;
    border: 0;
    border-bottom: 2px solid var(--color);
    color: var(--color);
    font-family: "Scope-LightExpanded";
    font-size: 2rem;
    outline: none;
    width: 100%;
    &:focus {
      border-color: var(--second);
      color: var(--second);
    }
    &::placeholder {
      /* font-weight: bold;
    opacity: .5; */
      color: var(--color);
    }
  }
  label {
    font-size: 2rem;
  }
  .list {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 2rem;
  }
`;

const ShowList = () => {
  const [documents] = usePrismicDocumentsByType("shows", {
    pageSize: 200,
  });
  const [shows, setShows] = useState();
  const [q, setQ] = useState("");

  useEffect(() => {
    if (documents) {
      setShows(shuffle(documents.results));
    }
  }, [shows, documents]);
  if (!documents && !shows) return <></>;
  return (
    <Container>
      <label htmlFor="search-form">
        {/* <span className="sr-only">Search</span>&nbsp; */}
        <input
          type="search"
          name="search-form"
          id="search-form"
          className="search-input"
          placeholder="Search for ..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </label>

      <p>
        {
          shows?.filter(
            (show) =>
              show.data.title
                .toString()
                .toLowerCase()
                .indexOf(q.toLowerCase()) > -1
          )?.length
        }{" "}
        of {shows?.length} shows match your criteria!
      </p>
      <div className="list">
        {shows
          ?.filter(
            (show) =>
              show.data.title.toString().toLowerCase().indexOf(q.toLowerCase()) >
              -1
          )
          .map((show) => (
            <ShowItem key={show.id} show={show} />
          ))}
      </div>
    </Container>
  );
};
export default ShowList;
