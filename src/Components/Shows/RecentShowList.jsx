import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import React from "react";
import { Link } from "react-router-dom";
import { Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import RecentShowItem from "./RecentShowItem";
import { getShowsQuery } from "./ShowList";

import "swiper/css";
import "swiper/css/navigation";
import { ExploreButton } from "../Broadcasts/RecentBroadcastList";

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

const RecentShowsSectionLoader = () => {
  return (
    <>loading section ...</>
  )
}

const RecentShowList = () => {
  const { loading, error, data } = useQuery(getShowsQuery, { variables: { itemsPerPage: 10 } })

  if (loading) return <RecentShowsSectionLoader />;
  if (error) return <>Error : {error.message}</>;
  const shows = data.allShowss.edges
  return (
    <Container>
      <h3><span>Shows</span><span></span></h3>
      <Swiper navigate={true} modules={[Navigation]} slidesPerView={2} className="list">
        {shows.map(show => (<SwiperSlide>
          <RecentShowItem show={show} />
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
export default RecentShowList;
