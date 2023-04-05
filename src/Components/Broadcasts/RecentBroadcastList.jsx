import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

import dayjs from "dayjs";
import "swiper/css";
import "swiper/css/navigation";
import { getBroadcastsInRangeQuery } from "../AudioPlayer/StreamShortInfo";
import BroadcastItem from "./BroadcastItem";

const Container = styled.div`
  h3 {
    padding: 0 1rem 0 2rem;
    margin: 0 !important;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    span:first-of-type {
      border-right: 2px solid var(--color);
      padding: 1rem 0 .5rem 0;
    }
    
  }
  .list {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
`;

const RecentBroadcastsSectionLoader = () => {
  return (
    <>loading section ...</>
  )
}

const ExploreButtonContainer = styled.button`
  border: none;
  background: var(--grey);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-bold);
  font-size: 2rem;
`

const ExploreButton = () => {
  return (<ExploreButtonContainer>
    Explore
  </ExploreButtonContainer>)
}

const RecentBroadcastList = () => {
  const { loading, error, data } = useQuery(getBroadcastsInRangeQuery, {
    variables: {
      endAfter: dayjs().subtract(14, 'days').format(),
      beginBefore: dayjs().subtract(7, 'days').format(),
      itemsPerPage: 10
    }
  })
  const navigate = useNavigate()

  if (loading) return <RecentBroadcastsSectionLoader />;
  if (error) return <>Error : {error.message}</>;
  const broadcasts = data.allBroadcastss.edges
  return (
    <Container>
      <h3><span>Recent Broadcasts</span><span></span></h3>
      <Swiper navigate={true} modules={[Navigation]} slidesPerView={4} className="list">
        {broadcasts.map(broadcast => (<SwiperSlide>
          <BroadcastItem broadcast={broadcast} />
        </SwiperSlide>
        ))}
        <SwiperSlide>
          <ExploreButton onClick={() => navigate('explore')} />
        </SwiperSlide>
      </Swiper>
    </Container>
  );
};
export default RecentBroadcastList;
