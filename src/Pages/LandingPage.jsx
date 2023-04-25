import React from "react";
import FeatureBroadcast from "../Components/Broadcasts/FeatureBroadcast";
import RecentBroadcastList from "../Components/Broadcasts/RecentBroadcastList";
import Bulletin from "../Components/Bulletin/Bulletin";
import Footer from "../Components/Footer";
import HeaderOffset from "../Components/HeaderOffset";
import Schedule from "../Components/Schedule/Schedule";
import RecentShowList from "../Components/Shows/RecentShowList";

const LandingPage = () => {
  return (
    <>
      <HeaderOffset>
        <FeatureBroadcast />
        <Bulletin />
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
