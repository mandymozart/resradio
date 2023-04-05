import styled from "@emotion/styled";
import clsx from "clsx";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import utc from "dayjs/plugin/utc";
import React from "react";
import { Link } from "react-router-dom";
import useBroadcastStore from "../Stores/BroadcastStore";
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

  const { currentBroadcast, nextBroadcast } = useBroadcastStore();

  return (<Container>
    <div className={clsx({ isCollapsed })}>
      <div className="side currentBroadcast">

        {currentBroadcast ? (
          <>

            <div className="image">
              <ThumbnailImage image={currentBroadcast.node.image} />
            </div>
            <div className="meta">
              <div className="date">
                {dayjs(currentBroadcast.node.begin).format("ddd dd:MM:YYYY")}<br />
                {dayjs(currentBroadcast.node.begin).format("h:mm")}&mdash;{dayjs(currentBroadcast.node.end).format("h:mm A")}
              </div>
              <h4>
                {currentBroadcast.node.hostedby._meta.uid}{" "}
                <span>{currentBroadcast.node.title}</span>
              </h4>
              <p className="description">
                {currentBroadcast.node.description}
              </p>

              <Link to={currentBroadcast.node.hostedby}>
                Read more
              </Link>
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
        empty
      </div>
      <footer>
        <div>
          <span>&gt;NEXT</span> {nextBroadcast?.node.hostedby.title} - {nextBroadcast?.node.title}
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