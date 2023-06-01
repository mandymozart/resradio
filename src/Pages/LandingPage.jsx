import styled from "@emotion/styled";
import React from "react";
import FeatureBroadcast from "../Components/Broadcasts/FeatureBroadcast";
import RecentBroadcastList from "../Components/Broadcasts/RecentBroadcastList";
import Announcement from "../Components/Bulletin/Announcement";
import Footer from "../Components/Footer";
import Schedule from "../Components/Schedule/Schedule";
import RecentShowList from "../Components/Shows/RecentShowList";
import Apply from "../images/Apply";

const BulletinSection = styled.section`
  padding: 2rem;
  display: grid;
  grid-row: span 2;
  gap: 2rem;
  grid-template-columns: 1fr 1fr;
  border-bottom: 2px solid var(--color);
  svg {
    max-width: 100%;
  }
`
const LandingPage = () => {
  return (
    <>
      <FeatureBroadcast />
      <BulletinSection>
        <Schedule />
        <Announcement />
        <Apply />
      </BulletinSection>
      <RecentShowList />
      <RecentBroadcastList />
      <Footer />
    </>
  );
};

export default LandingPage;
