import React, { useEffect } from "react";
import FadeIn from "../Animations/FadeIn";
import Button from "../Components/Button";
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
        <h2>Get to know the commies!</h2>
      </FadeIn>
      <FadeIn>
        <p>Join us on one of our exciting events around town or the internet.</p>
        <a href={"https://discord.gg/Q329eD2v8U"} target="_blank">
          <Button>Submit yours</Button>
          </a>
      </FadeIn>
      <Divider/>
      <EventList />
    </Layout>
  );
};

export default Events;
