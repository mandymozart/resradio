import React, { useEffect } from "react";
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
      <EventList />
    </Layout>
  );
};

export default Events;
