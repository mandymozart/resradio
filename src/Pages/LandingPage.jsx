import React from "react";
import About from "../Components/About/About";
import EventList from "../Components/Events/EventList";
import Layout from "../Components/Layout";

const LandingPage = () => {
  return (
    <Layout>
      <About />
      <EventList/>
    </Layout>
  );
};

export default LandingPage;
