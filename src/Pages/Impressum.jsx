import React, { useEffect } from "react";
import HeaderOffset from "../Components/HeaderOffset";
import ViennaStruggleLogo from "../images/ViennaStruggleLogo";
import useThemeStore from "../Stores/ThemeStore";

const ImpressumPage = () => {
  const setKeyword = useThemeStore((store) => store.setKeyword);
  useEffect(() => {
    setKeyword("impress");
  }, [setKeyword]);
  return (
    <HeaderOffset>
      <h3>This page is made possible with contributions by:</h3>
      <h4>Concept &amp; Operations</h4>
      <ul>
        <li>Vero (Product Owner)</li>
        <li>Reimundo (Product Owner)</li>
        <li>Sabine (Management)</li>
        <li>Chris (Product Owner)</li>
        <li>Studio Schlagschatten (Design Concept)</li>
      </ul>
      <h4>Development</h4>
      <ViennaStruggleLogo />
      <ul>
        <li>Mandy Mozart (UX &amp; Code)</li>
        <li>Lena Thomaka (Design Advisor)</li>
      </ul>
      <h4>Acknowledgement</h4>
      <ul>
        <li>Jonas Pelzer (Scope Typeface)</li>
      </ul>
    </HeaderOffset>
  );
};

export default ImpressumPage;
