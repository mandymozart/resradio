import React, { useEffect } from "react";
import About from "../Components/About/About";
import Divider from "../Components/Divider";
import EventList from "../Components/Events/EventList";
import Layout from "../Components/Layout";
import useThemeStore from "../Stores/ThemeStore";

const LandingPage = () => {
  const setKeyword = useThemeStore(store => store.setKeyword);
  useEffect(() => {
    if (document) setKeyword("kermit");
  }, [setKeyword]);
  return (
    <Layout>
      <About hideContent={true} />
      <Divider/>
      <EventList/>
    </Layout>
  );
};

export default LandingPage;
