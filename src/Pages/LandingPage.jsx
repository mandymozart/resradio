import styled from "@emotion/styled";
import React from "react";
import FeatureBroadcast from "../Components/Broadcasts/FeatureBroadcast";
import RecentBroadcastList from "../Components/Broadcasts/RecentBroadcastList";
import Announcement from "../Components/Bulletin/Announcement";
import Footer from "../Components/Footer";
import Schedule from "../Components/Schedule/Schedule";
import RecentShowList from "../Components/Shows/RecentShowList";
import { BREAKPOINT_MD, BREAKPOINT_XS } from "../config";
import Apply from "../images/Apply";

const BulletinSection = styled.section`
  padding: 2rem;
  display: grid;
  grid-row: span 2;
  gap: 2rem;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: minmax(auto, 1fr);
  border-bottom: 2px solid var(--color);
  @media (max-width: ${BREAKPOINT_MD}px) {
    grid-template-columns: 1fr;
  }
  @media (max-width: ${BREAKPOINT_XS}px) {
    padding: 1rem;
    gap: 1rem;
  }
  .apply {
    svg {
      width: 100%;
      height: 100%;
    }
  }
`
const LandingPage = () => {
  return (
    <>
      <FeatureBroadcast />
      <BulletinSection>
        <Schedule />
        <Announcement />
        <a className="apply" href="mailto:resradio.program@gmail.com"><Apply /></a>
      </BulletinSection>
      <RecentShowList />
      <RecentBroadcastList />
      <Footer />
    </>
  );
};

export default LandingPage;
