import React, { useEffect } from "react";
import FadeIn from "../Animations/FadeIn";
import Divider from "../Components/Divider";
import EventList from "../Components/Events/EventList";
import Layout from "../Components/Layout";
import useThemeStore from "../Stores/ThemeStore";

const Events = () => {
  const setKeyword = useThemeStore((store) => store.setKeyword);
  useEffect(() => {
    setKeyword("show");
  }, [setKeyword]);
  return (
    <Layout>
      <FadeIn>
        <h2>Get to know the community!</h2>
      </FadeIn>
      <FadeIn>
        <p>Join us on one of our exciting events around town or the internet.</p>
      </FadeIn>
      <Divider/>
      <EventList />
    </Layout>
  );
};

export default Events;
