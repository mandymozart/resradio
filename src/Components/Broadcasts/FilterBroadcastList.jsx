import { useLazyQuery } from "@apollo/client";
import styled from "@emotion/styled";
import React, { useEffect } from "react";

import "swiper/css";
import "swiper/css/navigation";
import useDebounce from "../../Hooks/useDebounce.";
import { getBroadcastsQuery } from "../../Queries/broadcasts";
import useFilterStore from "../../Stores/FilterStore";
import SectionLoader from "../SectionLoader";
import BroadcastItem from "./BroadcastItem";

const Container = styled.div`
  h3 {
    padding: 1rem 1rem .5rem 2rem;
    margin: 0;
    margin-bottom: 1rem;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;  
  }
  .list {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
`;


const FilterBroadcastList = () => {
  const { selectedMood, genres, slowest, fastest, isDirty } = useFilterStore();
  const [getData, { loading, error, data }] = useLazyQuery(
    getBroadcastsQuery, {
    variables: {
      sortBy: 'begin_ASC',
      first: 10,
      tags: genres,
      mood: selectedMood,
      bpm_range: [slowest, fastest]
    }
  });

  const debouncedRequest = useDebounce(() => {
    if (isDirty()) {
      getData()
    }
  });

  useEffect(() => {
    const unsub = useFilterStore.subscribe(debouncedRequest)
  }, [])

  if (loading) return <SectionLoader />;
  if (error) return <Container>Error : {error.message}</Container>;
  if (!isDirty()) return <></>
  return (
    <Container>
      <div className="list">
        {data?.allBroadcastss?.edges?.map((broadcast) =>
          <BroadcastItem broadcast={broadcast} />
        )}
      </div>
    </Container>
  );
};
export default FilterBroadcastList;
