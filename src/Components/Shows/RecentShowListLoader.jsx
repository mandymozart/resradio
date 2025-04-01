import styled from "@emotion/styled";
import React from "react";
import { BREAKPOINT_MD, BREAKPOINT_XS } from "../../config";
import placeholder from "../../images/placeholder-panorama-thumbnail-grey.png";
import SkeletonLoader from "../Loaders/SkeletonLoader";

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
    display: flex;
    @media (max-width: ${BREAKPOINT_MD}px) {
    .second {
        display: none;
      }
    }
  }
  .meta {
    padding: 1rem 2rem 3rem;
    .heading {
      margin: 2rem 0px 0.25rem
    }
    .tags {
      margin-top: 1rem;
      margin-bottom: .5rem;
      display: flex;
      gap: .5rem;
      @media (max-width: ${BREAKPOINT_XS}px) {
        display: none;
      }
    }
  }
`;

const RecentShowsListLoader = () => {
  return (
    <Container>
      <h3>Shows</h3>
      <div className="list">
        <div className="first">
          <img src={placeholder} alt="nix" />
          <div className="meta">
            <SkeletonLoader width={17} fontSize={1.5} className="heading" />
            <SkeletonLoader width={6} fontSize={1} />
            <SkeletonLoader width={8} fontSize={1} />
            <div className="tags">
              <SkeletonLoader width={5} fontSize={2} />
              <SkeletonLoader width={5} fontSize={2} />
              <SkeletonLoader width={5} fontSize={2} />
            </div>
          </div>
        </div>
        <div className="second">
          <img src={placeholder} alt="nix" />
          <div className="meta">
            <SkeletonLoader width={19} fontSize={1.5} className="heading" />
            <SkeletonLoader width={6} fontSize={1} />
            <SkeletonLoader width={8} fontSize={1} />
            <div className="tags">
              <SkeletonLoader width={5} fontSize={2} />
              <SkeletonLoader width={6} fontSize={2} />
              <SkeletonLoader width={4} fontSize={2} />
            </div>
          </div>
        </div>
      </div>

    </Container>
  );
};
export default RecentShowsListLoader;
