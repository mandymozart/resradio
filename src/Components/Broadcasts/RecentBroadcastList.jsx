import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import React from "react";
import { Link } from "react-router-dom";
import { Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

import dayjs from "dayjs";
import "swiper/css";
import "swiper/css/navigation";
import { BREAKPOINT_MD } from "../../config";
import { getBroadcastsInRangeQuery } from "../AudioPlayer/StreamShortInfo";
import SectionLoader from "../SectionLoader";
import ThumbnailImage from "../TeaserImage/ThumbnailImage";
import BroadcastItem from "./BroadcastItem";

const Container = styled.div`
  border-bottom: 2px solid var(--color);
  @media (max-width: ${BREAKPOINT_MD}px) {
    padding: 1rem;
  }
  h3 {
    margin: 0 !important;
    padding: 1rem 2rem .5rem 2rem;
    @media (max-width: ${BREAKPOINT_MD}px) {
      padding: 1rem 1rem 0 1rem;
    }
  }
  .swiper-button-next {
    right: 2rem;
    left: auto;
    @media (max-width: ${BREAKPOINT_MD}px) {
      right: 1rem;
    }
  }
  .swiper-button-prev {
    left: 2rem;
    right: auto;
    @media (max-width: ${BREAKPOINT_MD}px) {
      left: 1rem;
    }
  }
  
  .swiper-button-next, .swiper-button-prev {
    position: absolute;
    top: calc(50% - 6rem);
    width: 4rem;
    height: 6rem;
    z-index: 10;
    cursor: pointer;
    display: flex;
    background-color: var(--grey);
    align-items: center;
    justify-content: center;
    color: var(--color);
    &.swiper-button-disabled {
      display: none;
    }
}
`;

const RecentBroadcastsSectionLoader = () => {
  return (
    <SectionLoader />
  )
}

const ExploreButtonContainer = styled.button`
  border: none;
  padding: 0 2rem;
  display: flex;
  background: transparent;
  justify-content: center;
  font-family: var(--font-bold);
  font-size: 2rem;
  width:100%;
  cursor: pointer;
  position: relative;
  span {
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%,-50%);
  }
  &:hover {
    color: var(--second);
  }
`

const ExploreButton = () => {
  return (<ExploreButtonContainer>
    <div>
      <ThumbnailImage />
      <span>
        Explore
      </span>
    </div>
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

  if (loading) return <RecentBroadcastsSectionLoader />;
  if (error) return <>Error : {error.message}</>;
  const broadcasts = data.allBroadcastss.edges
  return (
    <Container>
      <h3>Recent Broadcasts</h3>
      <Swiper
        navigation
        modules={[Navigation]}
        slidesPerView={1}
        breakpoints={{
          480: {
            slidesPerView: 2,
          },
          769: {
            slidesPerView: 3,
          },
          1279: {
            slidesPerView: 4,
          },
        }}
        className="list"
      >
        {broadcasts.map((broadcast, index) => (<SwiperSlide key={"recentBroadcastSlider" + index}>
          <BroadcastItem broadcast={broadcast} />
        </SwiperSlide>
        ))}
        <SwiperSlide>
          <Link to={'explore'}>
            <ExploreButton />
          </Link>
        </SwiperSlide>
      </Swiper>
    </Container>
  );
};
export default RecentBroadcastList;
