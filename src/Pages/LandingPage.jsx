import React from "react";
import { MobileView } from "react-device-detect";
import FadeIn from "../Animations/FadeIn";
import Announcement from "../Components/Announcement/Announcement";
import FeatureBroadcast from "../Components/Broadcasts/FeatureBroadcast";
import Footer from "../Components/Footer";
import HeaderOffset from "../Components/HeaderOffset";
import Schedule from "../Components/Schedule/Schedule";

const LandingPage = () => {
  return (
    <>
      <HeaderOffset>
        <FadeIn>
          <FeatureBroadcast />
        </FadeIn>
        <MobileView>
          <FadeIn>
            <Announcement />
          </FadeIn>
        </MobileView>
        <Schedule />
        {/* <Events />
        <RecentShowList />
        <Broadcasts /> */}
      </HeaderOffset>
      <Footer />
    </>
  );
};

export default LandingPage;
