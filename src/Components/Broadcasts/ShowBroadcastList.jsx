import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import React from "react";

import { gql } from "graphql-tag";
import "swiper/css";
import "swiper/css/navigation";
import { BroadcastFragment, BroadcastTagsFragment, GetBroadcastByShowQuery } from "../../Queries/broadcasts";
import BigArrow from "../../images/BigArrow";
import SectionLoader from "../SectionLoader";
import ShowBroadcastItem from "./ShowBroadcastItem";


export const getBroadcastsByShowQuery = gql`
${GetBroadcastByShowQuery}
${BroadcastFragment}
${BroadcastTagsFragment}
`


const Container = styled.div`
  h3 {
    padding: 1rem 1rem .5rem 2rem;
    margin: 0 !important;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;  
  }
  .list {
    
  }
  button {
  background: none;
  border: none;

  width: 100%;
  padding: 2rem;
  margin: 0;
  text-align: center;
  cursor: pointer;
  div {
    text-transform: uppercase;
    font-size: 1rem;
    font-family: var(--font-light);
    margin-bottom: 1rem;
  }
  &:hover {
    color: var(--second);
  }
}
`;


const ShowBroadcastList = ({ id }) => {
  const { loading, error, data } = useQuery(getBroadcastsByShowQuery, {
    variables: {
      id: id,
      itemsPerPage: 20
    }
  })

  const loadMore = () => {
    console.log("not implemented")
  }

  if (loading) return <SectionLoader />;
  if (error) return <>Error : {error.message}</>;
  const broadcasts = data.allBroadcastss.edges
  return (
    <Container>
      <h3>Recent Broadcasts ({data.allBroadcastss.totalCount})</h3>
      <div className="list">
        {broadcasts.map(broadcast => (<ShowBroadcastItem broadcast={broadcast} />))}
      </div>
      {data.allBroadcastss.pageInfo.hasNextPage && (
        <button onClick={() => loadMore()}><div>load more</div>
          <BigArrow />
        </button>
      )}
    </Container>
  );
};
export default ShowBroadcastList;
