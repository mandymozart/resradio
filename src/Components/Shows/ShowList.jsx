import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { gql } from "graphql-tag";
import React, { useState } from "react";
import { GetShowsQuery, ShowFragment } from "../../Queries/shows";
import PageLoader from "../PageLoader";
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
  form {
    border-bottom: 2px solid var(--color);
    padding: 0 2rem;
  }
  .list {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;

  }
`;

const ShowList = () => {
  const { loading, error, data } = useQuery(getShowsQuery);
  const [q, setQ] = useState("");

  if (loading) return <PageLoader />;
  if (error) return <>Error : {error.message}</>;
  const shows = data.allShowss.edges
  return (
    <Container>
      {/* <form>
        {
          shows?.filter(
            (show) =>
              show.node.title
                .toString()
                .toLowerCase()
                .indexOf(q.toLowerCase()) > -1
          )?.length
        }{" "}
        of {data.allShowss.totalCount} shows match your criteria!
        <label htmlFor="search-form">
         <span className="sr-only">Search</span>&nbsp; 
           <input
          type="search"
          name="search-form"
          id="search-form"
          className="search-input"
          placeholder="Search for ..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        /> 
          <FilterForm /> 
        </label>
      </form> */}
      <div className="list">
        {shows
          ?.filter(
            (show) =>
              show.node.title.toString().toLowerCase().indexOf(q.toLowerCase()) >
              -1
          )
          .map((show) => (
            <ShowItem key={show.node._meta.id} show={show} />
          ))}
      </div>
    </Container>
  );
};
export default ShowList;
