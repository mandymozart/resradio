import { useLazyQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { gql } from "graphql-tag";
import React, { useEffect } from "react";

import "swiper/css";
import "swiper/css/navigation";
import { BroadcastFragment, BroadcastTagsFragement, GetBroadcastByTagQuery } from "../../Queries/broadcasts";
import useFilterStore from "../../Stores/FilterStore";
import SectionLoader from "../SectionLoader";
import BroadcastItem from "./BroadcastItem";

const Container = styled.div`
  border-bottom: 2px solid var(--color);
  h3 {
    padding: 1rem 1rem .5rem 2rem;
    margin: 0 !important;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;  
  }
  .list {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
`;



export const getBroadcastByTagQuery = gql`
${GetBroadcastByTagQuery}
${BroadcastFragment}
${BroadcastTagsFragement}
`

const FilterBroadcastList = () => {
  const [getData, { loading, error, data }] = useLazyQuery(getBroadcastByTagQuery);
  const { moods, genres, tempos } = useFilterStore();

  /** Hack for demo */
  const getFirstTag = () => {
    if (moods.length > 0) return moods[0].value
    if (genres.length > 0) return genres[0].value
    if (tempos.length > 0) return tempos[0].value
    return null
  }

  useEffect(() => {
    if (getFirstTag() !== null)
      getData({
        variables: { id: getFirstTag() }
      })
  }, [moods, genres, tempos]);

  if (loading) return <SectionLoader />;
  if (error) return <>Error : {error.message}</>;
  console.log(data?.allBroadcastss.totalCount < 1)
  if (!data?.allBroadcastss.totalCount) return <></>
  return (
    <Container>
      <h3>Broadcasts ({data?.allBroadcastss.totalCount})</h3>

      <div className="list">
        {data?.allBroadcastss?.edges?.map((broadcast) =>
          <BroadcastItem broadcast={broadcast} />
        )}
      </div>
    </Container>
  );
};
export default FilterBroadcastList;
