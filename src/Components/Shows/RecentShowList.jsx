import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import React from "react";
import { Link } from "react-router-dom";
import { Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { getBroadcastsQuery } from "../../Queries/broadcasts";
import { BREAKPOINT_MD, BREAKPOINT_XS, ITEMS_PER_PAGE, RECENT_SHOWS_BEGIN_BEFORE, RECENT_SHOWS_END_AFTER } from "../../config";
import placeholder from "../../images/placeholder-panorama-thumbnail-secondary.png";
import SystemMessage from "../SystemMessage";
import RecentShowItem from "./RecentShowItem";
import RecentShowsListLoader from "./RecentShowListLoader";
dayjs.extend(utc);

const Container = styled.div`
  border-bottom: 1px solid var(--color);
  h3 {
    padding: 3rem 2rem;
    margin: 0 !important;
    @media (max-width: ${BREAKPOINT_XS}px) {
      padding: 0.5rem 1rem;
      font-size: 1.5rem;
    }
  }
  .list {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
  .swiper-button-next {
    right: 2rem;
    left: auto;
    @media (max-width: ${BREAKPOINT_XS}px) {
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
    top: calc(50% - 8rem);
    @media (max-width: ${BREAKPOINT_MD}px) {
      top: calc(50% - 4rem);
    }
    width: 4rem;
    height: 6rem;
    z-index: 10;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--background);
    &.swiper-button-disabled {
      display: none;
    }
    &:hover {
      &::after {
        color: var(--second);
      }
    }
    &::after {
      font-size: 2rem;
    }
}
`;

const AllShowsButtonContainer = styled.button`
  border: none;
  padding: 0;
  display: flex;
  background: transparent;
  justify-content: center;
  font-family: var(--font-bold);
  font-size: 2rem;
  text-align: center;
  color: var(--background);
  width:100%;
  cursor: pointer;
  position: relative;
  span {
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%,-50%);
    text-transform: uppercase;
  }
  &:hover {
    color: var(--yellow);
  }
`

const AllShowsButton = () => {
  return (<AllShowsButtonContainer>
    <div>
      <img src={placeholder} alt="nix" />
      <span>
        All Shows
      </span>
    </div>
  </AllShowsButtonContainer>)
}

const RecentShowsList = () => {
  const { loading, error, data } = useQuery(getBroadcastsQuery,
    {
      variables: {
        sortBy: "begin_DESC",
        endAfter: dayjs().subtract(RECENT_SHOWS_END_AFTER, 'days').format(),
        beginBefore: dayjs().add(RECENT_SHOWS_BEGIN_BEFORE, 'days').format(),
        itemsPerPage: 100
      }
    })

  if (loading) return <RecentShowsListLoader />;
  if (error) return <SystemMessage>Error : {error.message}</SystemMessage>;
  const broadcasts = data.allBroadcastss.edges
  if (broadcasts.length === 0) return <></>
  return (
    <Container>
      <h3>Shows</h3>
      <Swiper
        navigation
        modules={[Navigation]}
        slidesPerView={1}
        breakpoints={{
          769: {
            slidesPerView: 2,
          },
        }}
        className="list">
        {broadcasts.slice(0, ITEMS_PER_PAGE).map((broadcast, index) => (<SwiperSlide key={"showSlider" + index}>
          <RecentShowItem broadcast={broadcast} />
        </SwiperSlide>
        ))}
        <SwiperSlide>
          <Link to={'shows'}>
            <AllShowsButton />
          </Link>
        </SwiperSlide>
      </Swiper>
    </Container>
  );
};
export default RecentShowsList;
