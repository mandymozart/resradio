import { useLazyQuery } from "@apollo/client";
import styled from "@emotion/styled";
import React, { useEffect } from "react";

import { useSearchParams } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";
import { searchShowsQuery } from "../../Queries/documents";
import useThemeStore from "../../Stores/ThemeStore";
import SectionLoader from "../SectionLoader";
import SystemMessage from "../SystemMessage";
import SearchBroadcastItem from "./SearchBroadcastItem";
import SearchPageItem from "./SearchPageItem";
import SearchShowItem from "./SearchShowItem";

const Container = styled.div`
  h2 {
    padding: 3rem 2rem;
    margin: 0 !important;
  }
`;

const SearchDocumentsList = () => {
  const [searchParams] = useSearchParams();
  const { setSearchbarIsVisible } = useThemeStore()

  const [getData, { loading, error, data }] = useLazyQuery(searchShowsQuery, { variables: { q: searchParams.get("q") } })

  useEffect(() => {
    if (searchParams?.get("q")?.length > 0) {
      getData()
    } else {
      setSearchbarIsVisible(true);
    }
  }, [searchParams])

  if (loading) return <SectionLoader />;
  if (error) return <SystemMessage>Error : {error.message}</SystemMessage>;
  // TODO: totalCount is not true, since only 3 types of documents are eventually used for the rendering loop
  if (data?._allDocuments?.totalCount < 1) return <SystemMessage>No results match your search query!</SystemMessage>
  return (
    <Container>
      <div className="list">
        {data?._allDocuments.edges.map((doc, index) => {
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
