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
        <h2>Schedule</h2>
      </FadeIn>
      <FadeIn>
        <p>Our programme is carefully selected and community driven.</p>
        <a href={"mailto:program.resradio@gmail.com"} target="_blank">
          <Button>Apply with your own show</Button>
        </a>
      </FadeIn>
      <Divider />
      <EventList />
      <Divider />
    </Layout>
  );
};

export default Events;
