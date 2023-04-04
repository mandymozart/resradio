import React from "react";
import { MobileView } from "react-device-detect";
import FadeIn from "../Animations/FadeIn";
import Announcement from "../Components/Announcement/Announcement";
import FeatureBroadcast from "../Components/Broadcasts/FeatureBroadcast";
import Footer from "../Components/Footer";
import HeaderOffset from "../Components/HeaderOffset";

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
        {/* <Events />
        <RecentShowList />
        <Broadcasts /> */}
      </HeaderOffset>
      <Footer />
    </>
  );
};

export default LandingPage;
