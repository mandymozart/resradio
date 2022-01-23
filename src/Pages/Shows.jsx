import React, { useEffect } from "react";
import FadeIn from "../Animations/FadeIn";
import Divider from "../Components/Divider";
import Layout from "../Components/Layout";
import ShowList from "../Components/Shows/ShowList";
import useThemeStore from "../Stores/ThemeStore";

const Shows = () => {
  const setKeyword = useThemeStore((store) => store.setKeyword);
  useEffect(() => {
    setKeyword("spectacle");
  }, [setKeyword]);
  return (
    <Layout>
      <FadeIn>
        <h2>Meet our show hosts</h2>
      </FadeIn>
      <FadeIn>
        <p>We are an open call radio. Hosts can apply with a program here.</p>
      </FadeIn>
      <Divider/>
      <ShowList />
    </Layout>
  );
};

export default Shows;
