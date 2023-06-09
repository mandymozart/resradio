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
import SectionLoader from "../SectionLoader";
import SystemMessage from "../SystemMessage";
import ThumbnailPanoramaImage from "../TeaserImage/ThumbnailPanoramaImage";
import RecentShowItem from "./RecentShowItem";
dayjs.extend(utc);

const Container = styled.div`
  border-bottom: 2px solid var(--color);
  h3 {
    padding: 3rem 2rem;
    margin: 0 !important;
  }
  .list {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
  .swiper-button-next {
    right: 2rem;
    left: auto;
  }
  .swiper-button-prev {
    left: 2rem;
    right: auto;
  }
  
  .swiper-button-next, .swiper-button-prev {
    position: absolute;
    top: calc(50% - 8rem);
    width: 4rem;
    height: 6rem;
    z-index: 10;
    cursor: pointer;
    display: flex;
    background-color: var(--color);
    align-items: center;
    justify-content: center;
    color: var(--background);
    &.swiper-button-disabled {
      display: none;
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

const AllShowsButton = () => {
  return (<AllShowsButtonContainer>
    <div>
      <ThumbnailPanoramaImage />
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
        sortBy: "begin_ASC",
        endAfter: dayjs().format(),
        beginBefore: dayjs().add(7, 'days').format(),
        itemsPerPage: 100
      }
    })

  // TODO: .filter(broadcast=>broadcast.node.audio !== null) !Limit output to 8
  if (loading) return <SectionLoader />;
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
        {broadcasts.map((broadcast, index) => (<SwiperSlide key={"showSlider" + index}>
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
