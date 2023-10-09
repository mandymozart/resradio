import styled from "@emotion/styled";
import React from "react";
import { BREAKPOINT_XS } from "../../config";
import placeholder from "../../images/placeholder-panorama-thumbnail-grey.png";
import SectionLoader from "../SectionLoader";

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
  }
  height: 15.125rem;
`;

const RecentShowsListLoader = () => {
  return (
    <Container>
      <h3>Shows</h3>
      <div className="list">
        <div>
          <img src={placeholder} alt="nix" />
        </div>
        <div>
          <img src={placeholder} alt="nix" />
        </div>
      </div>
      <SectionLoader />
    </Container>
  );
};
export default RecentShowsListLoader;
