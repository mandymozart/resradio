import React, { useEffect } from "react";
import About from "../Components/About/About";
import Divider from "../Components/Divider";
import Layout from "../Components/Layout";
import useThemeStore from "../Stores/ThemeStore";

const AboutPage = () => {
  const setKeyword = useThemeStore((store) => store.setKeyword);
  useEffect(() => {
    setKeyword("community");
  }, [setKeyword]);
  return (
    <Layout>
      <About />
      <Divider />
    </Layout>
  );
};

export default AboutPage;
