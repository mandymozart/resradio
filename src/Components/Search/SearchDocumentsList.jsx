import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { gql } from "graphql-tag";
import React from "react";

import { useSearchParams } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";
import { BroadcastFragment, BroadcastTagsFragment } from "../../Queries/broadcasts";
import { SearchDocumentsQuery } from "../../Queries/documents";
import { ShowFragment } from "../../Queries/shows";
import SectionLoader from "../SectionLoader";
import SearchBroadcastItem from "./SearchBroadcastItem";
import SearchShowItem from "./SearchShowItem";

const Container = styled.div`
  border-bottom: 2px solid var(--color);
  h3 {
    padding: 1rem 1rem 0.5rem 2rem;
    margin: 0 !important;
  }
  .list {

  }
`;


export const searchShowsQuery = gql`
  ${SearchDocumentsQuery}
  ${ShowFragment}
  ${BroadcastFragment}
  ${BroadcastTagsFragment}
`

const SearchDocumentsList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  console.log(searchParams.get("q"));

  const { loading, error, data } = useQuery(searchShowsQuery, { variables: { q: searchParams.get("q") } })

  if (loading) return <SectionLoader />;
  if (error) return <Container>Error : {error.message}</Container>;
  if (data._allDocuments.totalCount < 1) return <Container>No results match your search query!</Container>
  console.log(data._allDocuments)
  return (
    <Container>
      <div className="list">
        {data._allDocuments.edges.map((doc, index) => {
          console.log(doc.node.__typename)
          if (doc.node.__typename === "Shows")
            return <SearchShowItem show={doc.node} key={"result-list-show" + index} />
          if (doc.node.__typename === "Broadcasts")
            return <SearchBroadcastItem broadcast={doc.node} key={"result-list-broadcast" + index} />


        })}
      </div>
    </Container>
  );
};
export default SearchDocumentsList;
