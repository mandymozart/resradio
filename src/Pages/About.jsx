import React, { useEffect } from "react";
import About from "../Components/About/About";
import Divider from "../Components/Divider";
import HeaderOffset from "../Components/HeaderOffset";
import useThemeStore from "../Stores/ThemeStore";

const AboutPage = () => {
  const setKeyword = useThemeStore((store) => store.setKeyword);
  useEffect(() => {
    setKeyword("community");
  }, [setKeyword]);
  return (
    <HeaderOffset>
      <About />
      <Divider />
    </HeaderOffset>
  );
};

export default AboutPage;
