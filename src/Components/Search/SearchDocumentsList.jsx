import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { gql } from "graphql-tag";
import React from "react";

import { useSearchParams } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";
import { BroadcastFragment, BroadcastTagsFragment } from "../../Queries/broadcasts";
import { SearchDocumentsQuery } from "../../Queries/documents";
import { PageFragment } from "../../Queries/pages";
import { ShowFragment } from "../../Queries/shows";
import SectionLoader from "../SectionLoader";
import SystemMessage from "../SystemMessage";
import SearchBroadcastItem from "./SearchBroadcastItem";
import SearchPageItem from "./SearchPageItem";
import SearchShowItem from "./SearchShowItem";

const Container = styled.div`
  h3 {
    padding: 3rem 2rem;
    margin: 0 !important;
  }
`;

export const searchShowsQuery = gql`
  ${SearchDocumentsQuery}
  ${ShowFragment}
  ${BroadcastFragment}
  ${BroadcastTagsFragment}
  ${PageFragment}
`

const SearchDocumentsList = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const { loading, error, data } = useQuery(searchShowsQuery, { variables: { q: searchParams.get("q") } })

  if (loading) return <SectionLoader />;
  if (error) return <SystemMessage>Error : {error.message}</SystemMessage>;
  if (data._allDocuments.totalCount < 1) return <SystemMessage>No results match your search query!</SystemMessage>
  return (
    <Container>
      <div className="list">
        {data._allDocuments.edges.map((doc, index) => {
          console.log(doc.node.__typename)
          if (doc.node.__typename === "Shows")
            return <SearchShowItem show={doc.node} key={"result-list-show" + index} />
          if (doc.node.__typename === "Broadcasts")
            return <SearchBroadcastItem broadcast={doc.node} key={"result-list-broadcast" + index} />
          if (doc.node.__typename === "Page")
            return <SearchPageItem page={doc.node} key={"result-list-page" + index} />


        })}
      </div>
    </Container>
  );
};
export default SearchDocumentsList;
