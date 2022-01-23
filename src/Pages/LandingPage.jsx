import React, { useEffect } from "react";
import FadeIn from "../Animations/FadeIn";
import About from "../Components/About/About";
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
      <About hideContent={true} />
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
