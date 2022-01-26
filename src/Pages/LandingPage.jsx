import React, { useEffect } from "react";
import FadeIn from "../Animations/FadeIn";
import Announcement from "../Components/Announcement copy/Announcement";
import Divider from "../Components/Divider";
import EventList from "../Components/Events/EventList";
import Layout from "../Components/Layout";
import useThemeStore from "../Stores/ThemeStore";

const LandingPage = () => {
  const setKeyword = useThemeStore((store) => store.setKeyword);
  useEffect(() => {
    if (document) setKeyword("kermit");
  }, [setKeyword]);
  return (
    <Layout>
      <FadeIn>
        <h2>We are res.radio community radio Vienna</h2>
      </FadeIn>
      <Divider />
      <FadeIn>
        <Announcement />
      </FadeIn>
      <FadeIn>
        <EventList />
      </FadeIn>
    </Layout>
  );
};

export default LandingPage;
