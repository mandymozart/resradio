import React from "react";
import { MobileView } from "react-device-detect";
import Announcement from "../Components/Announcement/Announcement";
import FeatureBroadcast from "../Components/Broadcasts/FeatureBroadcast";
import RecentBroadcastList from "../Components/Broadcasts/RecentBroadcastList";
import Footer from "../Components/Footer";
import HeaderOffset from "../Components/HeaderOffset";
import Schedule from "../Components/Schedule/Schedule";
import RecentShowList from "../Components/Shows/RecentShowList";

const LandingPage = () => {
  return (
    <>
      <HeaderOffset>
        <FeatureBroadcast />
        <MobileView>
          <Announcement />
        </MobileView>
        <Schedule />
        <RecentShowList />
        <RecentBroadcastList />
        {/* <Events />
        <Broadcasts /> */}
      </HeaderOffset>
      <Footer />
    </>
  );
};

export default LandingPage;
