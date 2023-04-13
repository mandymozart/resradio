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
import SectionLoader from "../SectionLoader";
import ThumbnailPanoramaImage from "../TeaserImage/ThumbnailPanoramaImage";

const Container = styled.div`
  border-bottom: 2px solid var(--color);
  h3 {
    padding: 1rem 1rem 0.5rem 2rem;
    margin: 0 !important;
  }
  .list {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
`;

const RecentShowsSectionLoader = () => {
  return (
    <Container>loading recent shows ...</Container>
  )
}

const AllShowsButtonContainer = styled.button`
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
  const { loading, error, data } = useQuery(getShowsQuery, { variables: { itemsPerPage: 10 } })

  if (loading) return <SectionLoader />;
  if (error) return <>Error : {error.message}</>;
  const shows = data.allShowss.edges
  return (
    <Container>
      <h3>Shows</h3>
      <Swiper navigation modules={[Navigation]} slidesPerView={2} className="list">
        {shows.map((show, index) => (<SwiperSlide key={"showSlider" + index}>
          <RecentShowItem show={show} />
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
