import { useLazyQuery } from "@apollo/client";
import styled from "@emotion/styled";
import React, { useEffect, useState } from "react";

import "swiper/css";
import "swiper/css/navigation";
import useDebounce from "../../Hooks/useDebounce.";
import { getBroadcastsQuery } from "../../Queries/broadcasts";
import useFilterStore from "../../Stores/FilterStore";
import { BREAKPOINT_L, BREAKPOINT_MD, BREAKPOINT_XS, ITEMS_PER_PAGE } from "../../config";
import LoadMoreButton from "../LoadMoreButton";
import SectionLoader from "../SectionLoader";
import SystemMessage from "../SystemMessage";
import BroadcastItem from "./BroadcastItem";

const Container = styled.div`
  h3 {
    padding: 1rem 1rem .5rem 2rem;
    margin: 0;
    margin-bottom: 1rem;
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
        grid-template-columns: minmax(0,1fr);
    }
  }
`;

const FilterBroadcastList = () => {
  const { selectedMood, genres, slowest, fastest, isDirty } = useFilterStore();
  const [endCursor, setEndCursor] = useState(null)
  const [broadcasts, setBroadcasts] = useState(null);
  const [isInitial, setIsInitial] = useState(true);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [getData, { loading, error, data }] = useLazyQuery(
    getBroadcastsQuery, {
    variables: {
      sortBy: 'begin_ASC',
      tags: genres,
      moodId: selectedMood?._meta.id,
      bpm_range: [slowest, fastest],
      itemsPerPage: ITEMS_PER_PAGE,
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
    if (isDirty()) {
      getData()
    }
  });

  useEffect(() => {
    useFilterStore.subscribe(debouncedRequest)
  }, [debouncedRequest])

  if (loading) return <SectionLoader />;
  if (error) return <Container><SystemMessage type="error">Error : {error.message}</SystemMessage></Container>;
  if (!isDirty()) return <></>
  return (
    <Container>

      {data?.allBroadcastss.totalCount === 0 ? (
        <SystemMessage>No match. You are quite the picky one!</SystemMessage>
      ) : (
        <div className="list">
          {broadcasts?.map((broadcast, index) => <div key={"broadcast" + index}>

            <BroadcastItem broadcast={broadcast} /></div>
          )}
        </div>)}
      {hasNextPage && (
        <LoadMoreButton onClick={() => loadMore()} loading={loading}>Load More</LoadMoreButton>
      )}
    </Container>
  );
};
export default FilterBroadcastList;
