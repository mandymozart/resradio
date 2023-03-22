import styled from "@emotion/styled";
import { PrismicLink } from "@prismicio/react";
import clsx from "clsx";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import utc from "dayjs/plugin/utc";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useBroadcastStore from "../Stores/BroadcastStore";
import useFilterStore from "../Stores/FilterStore";
import ThumbnailImage from "./TeaserImage/ThumbnailImage";
dayjs.extend(isBetween);
dayjs.extend(utc);

const Container = styled.menu`
margin: 0;
padding: 0;
border-bottom: 2px solid var(--color);
a {
      font-size: 1rem;
    }
    h4 {
      span {
        font-family: var(--font-light);
      }
      text-transform: initial;
    }
> div {
  z-index: 1;
  position: fixed;
  top: calc(10rem - 2.4rem);
  width: 100%;
  background: white;
  transform: translateY(-40rem);
  display: grid;
  grid-template-columns: 1fr 1fr;
  img {
    width: 100%;
  }

  &.isCollapsed {
    opacity: 1;
    transform: translateY(0);
  }

  .side {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    border-bottom: 2px solid var(--color);
    &.currentBroadcast {
      padding: 3rem 1rem 1rem 2rem;
      border-right: 2px solid var(--color);
    }
    &.currentFilter {
      padding: 3rem 2rem 1rem 1rem;
      color: var(--second);
    }
  }
  footer {
    display: flex;
    gap: 1rem;
    line-height: 3rem;
    justify-content: space-between;
    border-bottom: 2px solid var(--color);
    
    &:first-of-type {
      border-right: 2px solid var(--color);
      padding-left: 2rem;
      padding-right: 1rem;
    }
    &:last-of-type {
      padding-left: 1rem;
      padding-right: 2rem;
    }
  }
}
`
const SlideOut = ({ isCollapsed, setIsCollapsed }) => {

  const { currentBroadcast } = useBroadcastStore()
  const { currentBroadcast: currentFilteredShow } = useFilterStore()

  const navigate = useNavigate();

  const goToLink = (link) => {
    setIsCollapsed(false);
    navigate(link);
  };

  const isLive = (begin, end) => {
    return dayjs().isBetween(dayjs(begin), dayjs(end));
    // return true;
  };


  return (<Container>
    <div className={clsx({ isCollapsed })}>
      <div className="side currentBroadcast">

        {currentBroadcast ? (
          <>

            <div className="image">
              <ThumbnailImage image={currentBroadcast.data.image} />
            </div>
            <div className="meta">
              <div className="date">
                {dayjs(currentBroadcast.data.begin).format("ddd dd:MM:YYYY")}<br />
                {dayjs(currentBroadcast.data.begin).format("HH:mm")}&mdash;{dayjs(currentBroadcast.data.end).format("HH:mm")}
              </div>
              <h4>
                {currentBroadcast.data.hostedby.uid}{" "}
                <span>{currentBroadcast.data.title}</span>
              </h4>
              <p className="description">
                {currentBroadcast.data.description}
              </p>

              <PrismicLink field={currentBroadcast.data.hostedby}>
                Read more
              </PrismicLink>
            </div>
          </>) : <><div className="image">
            <img src="https://placehold.it/440x440" alt="" />
          </div>
          <div className="meta">
            <div className="date">
              Thu, 00.00.0000<br />
              00:00&mdash;00:00
            </div>
            <h4>
              Show<br />
              <span>Title</span>
            </h4>
            <p className="description">
              Lorem Ipsum
            </p>

            <Link to="/">
              Read more
            </Link>
          </div></>
        }
      </div>
      <div className="side currentFilter">
        {currentFilteredShow ? (
          <>
            <div className="image">
              <ThumbnailImage image={currentFilteredShow.data.image} />
            </div>
            <div className="meta">
              <div className="date">
                {dayjs(currentFilteredShow.data.begin).format("ddd dd:MM:YYYY")}<br />
                {dayjs(currentFilteredShow.data.begin).format("HH:mm")}&mdash;{dayjs(currentFilteredShow.data.end).format("HH:mm")}
              </div>
              <h4>
                {currentFilteredShow.data.hostedby.uid}<br />
                <span>{currentFilteredShow.data.title}</span>
              </h4>
              <p className="description">
                {currentFilteredShow.data.description}
              </p>

              <PrismicLink field={currentFilteredShow.data.hostedby}>
                Read more
              </PrismicLink>
            </div>
          </>) : <><div className="image">
            <img src="https://placehold.it/440x440" alt="" />
          </div>
          <div className="meta">
            <div className="date">
              Thu, 00.00.0000<br />
              00:00&mdash;00:00
            </div>
            <h4>
              Show<br />
              <span>Title</span>
            </h4>
            <p className="description">
              Lorem Ipsum
            </p>

            <Link to="/">
              Read more
            </Link>
          </div></>
        }
      </div>
      <footer>
        <div>
          <span>&gt;NEXT</span> Next Show - Title
        </div>
        <div>
          <Link to={"/schedule"}>Show Schedule</Link>
        </div>
      </footer>
      <footer>
        <div>
          <span>My Res Filter</span>
        </div>
        <div>
          <Link to={"/filter"}>Edit</Link>
        </div>
      </footer>

    </div>
  </Container>
  )
}

export default SlideOut;