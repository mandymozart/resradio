import { useLazyQuery } from "@apollo/client";
import styled from "@emotion/styled";
import React, { useEffect } from "react";

import { useSearchParams } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";
import { searchShowsQuery } from "../../Queries/documents";
import useThemeStore from "../../Stores/ThemeStore";
import { BREAKPOINT_XS } from "../../config";
import SectionLoader from "../SectionLoader";
import SystemMessage from "../SystemMessage";
import SearchBroadcastItem from "./SearchBroadcastItem";
import SearchPageItem from "./SearchPageItem";
import SearchShowItem from "./SearchShowItem";

const Container = styled.div`
h2 {
  padding: 2rem;
  @media (max-width: ${BREAKPOINT_XS}px) {
    padding: 1rem 1rem;
    font-size: 1.5rem;
  }
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
  }, [searchParams, getData, setSearchbarIsVisible])

  if (loading) return <SectionLoader />;
  if (error) return <SystemMessage>Error : {error.message}</SystemMessage>;
  // TODO: totalCount is not true, since only 3 types of documents are eventually used for the rendering loop
  if (data?._allDocuments?.totalCount < 1) return <SystemMessage>No results match your search query!</SystemMessage>
  return (
    <Container>
      {searchParams.get("q") && <h2>Results for "{searchParams.get("q")}"</h2>}
      <div className="list">
        {data?._allDocuments.edges.map((doc, index) => {
          if (doc.node.__typename === "Shows")
            return <SearchShowItem show={doc.node} key={"result-list-show" + index} />
          if (doc.node.__typename === "Broadcasts")
            return <SearchBroadcastItem broadcast={doc.node} key={"result-list-broadcast" + index} />
          if (doc.node.__typename === "Page")
            return <SearchPageItem page={doc.node} key={"result-list-page" + index} />
          return null
        })}
      </div>
    </Container>
  );
};
export default SearchDocumentsList;
