import { useLazyQuery } from "@apollo/client";
import styled from "@emotion/styled";
import React, { useEffect } from "react";

import "swiper/css";
import "swiper/css/navigation";
import useDebounce from "../../Hooks/useDebounce.";
import { getBroadcastsQuery } from "../../Queries/broadcasts";
import useFilterStore from "../../Stores/FilterStore";
import { BREAKPOINT_L, BREAKPOINT_MD, BREAKPOINT_XS } from "../../config";
import SectionLoader from "../SectionLoader";
import BroadcastItem from "./BroadcastItem";

const Container = styled.div`
  h3 {
    padding: 1rem 1rem .5rem 2rem;
    margin: 0;
    margin-bottom: 1rem;
  }
  .list {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    @media (max-width: ${BREAKPOINT_L}px) {
        grid-template-columns: 1fr 1fr 1fr;
    }
    @media (max-width: ${BREAKPOINT_MD}px) {
        grid-template-columns: 1fr 1fr;
    }
    @media (max-width: ${BREAKPOINT_XS}px) {
        grid-template-columns: 1fr;
    }
  }
`;

const Message = styled.div`
padding: 6rem 2rem;
text-align: center;
`;


const FilterBroadcastList = () => {
  const { selectedMood, genres, slowest, fastest, isDirty } = useFilterStore();
  const [getData, { loading, error, data }] = useLazyQuery(
    getBroadcastsQuery, {
    variables: {
      sortBy: 'begin_ASC',
      first: 10,
      tags: genres,
      moodId: selectedMood?._meta.id,
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
  if (error) return <Container><Message>Error : {error.message}</Message></Container>;
  if (!isDirty()) return <></>
  return (
    <Container>

      {data?.allBroadcastss.totalCount === 0 ? (
        <Message>No match. You are quite the picky one!</Message>
      ) : (<>
        <div className="list">
          {data?.allBroadcastss?.edges?.map((broadcast, index) => <div key={"broadcast" + index}>

            <BroadcastItem broadcast={broadcast} /></div>
          )}
        </div>
      </>
      )}
    </Container>
  );
};
export default FilterBroadcastList;
