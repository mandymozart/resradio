import styled from "@emotion/styled";
import React, { useEffect, useState } from "react";

import { useLazyQuery } from "@apollo/client";
import "swiper/css";
import "swiper/css/navigation";
import useDebounce from "../../Hooks/useDebounce.";
import { getBroadcastsByShowQuery } from "../../Queries/broadcasts";
import { BREAKPOINT_XS, ITEMS_PER_PAGE } from "../../config";
import LoadMoreButton from "../LoadMoreButton";
import SectionLoader from "../SectionLoader";
import SystemMessage from "../SystemMessage";
import ShowBroadcastsItem from "./ShowBroadcastsItem";

const Container = styled.div`
margin-bottom: 1rem;
  h3 {
    padding: 2rem;
    margin: 0;
    font-size: 1.5rem;
    @media (max-width: ${BREAKPOINT_XS}px) {
      padding: 1rem;
    }
  }
  .list {
    
  }
`;


const ShowBroadcastsList = ({ id }) => {
  const [endCursor, setEndCursor] = useState(null)
  const [broadcasts, setBroadcasts] = useState(null);
  const [isInitial, setIsInitial] = useState(true);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [getData, { loading, error, data }] = useLazyQuery(
    getBroadcastsByShowQuery, {
    variables: {
      id: id,
      itemsPerPage: ITEMS_PER_PAGE,
      sortBy: "begin_DESC",
      currentCursor: endCursor,
    }, onCompleted: (data) => {
      if (isInitial) setIsInitial(false);
      // more pages availables
      setHasNextPage(data.allBroadcastss.pageInfo.hasNextPage)
      // first page
      if (!data.allBroadcastss.pageInfo.hasPreviousPage) {
        setBroadcasts(data.allBroadcastss.edges)
      } else {
        if (data.allBroadcastss.edges[data.allBroadcastss.edges.length - 1].cursor !== broadcasts[broadcasts.length - 1].cursor)
          setBroadcasts([...broadcasts, ...data.allBroadcastss.edges])
      }
    }
  });


  const loadMore = () => {
    setEndCursor(data.allBroadcastss.pageInfo.endCursor)
    debouncedRequest();
  }

  const debouncedRequest = useDebounce(() => {
    getData()
  });

  useEffect(() => {
    getData()
  }, [getData])

  if (loading && isInitial) return <SectionLoader />;
  if (error) return <Container><SystemMessage message={error.message} type="error" /></Container>;
  return (
    <Container>
      <h3>Recent Broadcasts ({data?.allBroadcastss.totalCount})</h3>
      <div className="list">
        {broadcasts?.map((broadcast, index) => (<ShowBroadcastsItem key={index + broadcast.node._meta.uid} broadcast={broadcast} />))}
      </div>
      {hasNextPage && (
        <LoadMoreButton onClick={() => loadMore()} loading={loading}>Load More</LoadMoreButton>
      )}
    </Container>
  );
};
export default ShowBroadcastsList;
