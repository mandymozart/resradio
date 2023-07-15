import { useLazyQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { gql } from "graphql-tag";
import { noop } from "lodash";
import React, { useEffect, useState } from "react";
import useDebounce from "../../Hooks/useDebounce.";
import { GetShowsQuery, ShowFragment } from "../../Queries/shows";
import { BREAKPOINT_L, BREAKPOINT_MD, BREAKPOINT_XS, ITEMS_PER_PAGE } from "../../config";
import LoadMoreButton from "../LoadMoreButton";
import SectionLoader from "../SectionLoader";
import SystemMessage from "../SystemMessage";
import ShowItem from "./ShowItem";

export const getShowsQuery = gql`
  ${GetShowsQuery}
  ${ShowFragment}
`

const Container = styled.div`
  input {
    background: transparent;
    border: 0;
    border-bottom: 2px solid var(--color);
    color: var(--color);
    font-family: var(--font-light);
    font-size: 1rem;
    padding: 0;
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
  form {
    padding: 0 2rem;
  }
  .list {
    display: grid;
    grid-template-columns: repeat(4, minmax(0,1fr));
    @media (max-width: ${BREAKPOINT_L}px) {
        grid-template-columns: repeat(3, minmax(0,1fr));
    }
    @media (max-width: ${BREAKPOINT_MD}px) {
        grid-template-columns: repeat(2, minmax(0,1fr));
    }
    @media (max-width: ${BREAKPOINT_XS}px) {
        grid-template-columns: 1fr;
    }

  }
`;

const ShowList = () => {
  const [endCursor, setEndCursor] = useState(null)
  const [q, setQ] = useState("");
  const [shows, setShows] = useState(null);
  const [isInitial, setIsInitial] = useState(true);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [getData, { loading, error, data }] = useLazyQuery(
    getShowsQuery, {
    variables: {
      itemsPerPage: ITEMS_PER_PAGE,
      currentCursor: endCursor,
      q: q
    }
    , onCompleted: (data) => {
      if (isInitial) setIsInitial(false);
      // more pages availables
      setHasNextPage(data.allShowss.pageInfo.hasNextPage)
      // setEndCursor(data.allShowss.pageInfo.endCursor) // WTF, setting endCursor retriggersquery
      // first page
      if (!data.allShowss.pageInfo.hasPreviousPage) {
        setShows(data.allShowss.edges)
      } else {
        if (data.allShowss.edges[data.allShowss.edges.length - 1].cursor !== shows[shows.length - 1].cursor)
          setShows([...shows, ...data.allShowss.edges])
      }
    }
  });

  const debouncedRequest = useDebounce(() => {
    getData()
  });

  const loadMore = () => {
    setEndCursor(data.allShowss.pageInfo.endCursor)
    debouncedRequest();
  }

  useEffect(() => {
    getData();
  }, [])

  if (loading && isInitial) return <SectionLoader />;
  if (error) return <Container><SystemMessage message={error.message} type="error" /></Container>;
  return (
    <Container>
      <form onSubmit={() => noop()}>
        <label htmlFor="search-form">
          <input
            type="text"
            name="search-form"
            id="search-form"
            className="search-input"
            placeholder="Type to filter ... "
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </label>
      </form>
      <div className="list">
        {shows?.map((show) => (
          <ShowItem key={show.node._meta.id} show={show} />
        ))}
      </div>
      {hasNextPage && (
        <LoadMoreButton onClick={() => loadMore()} loading={loading}>Load More</LoadMoreButton>
      )}
    </Container>
  );
};
export default ShowList;
