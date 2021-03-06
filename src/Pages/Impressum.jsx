import React, { useEffect } from "react";
import Layout from "../Components/Layout";
import useThemeStore from "../Stores/ThemeStore";

const ImpressumPage = () => {
  const setKeyword = useThemeStore((store) => store.setKeyword);
  useEffect(() => {
    setKeyword("impress");
  }, [setKeyword]);
  return (
    <Layout>
      <h3>This page is made possible with contributions by:</h3>
      <ul>
        <li>Vero ... (Product Owner)</li>
        <li>Reimundo ... (Product Owner)</li>
        <li>Sabine ... (Management)</li>
        <li>Lena Thomaka (Design Advisor)</li>
        <li>Chris ... (Product Owner)</li>
        <li>Marcel &amp; ... (Design Concept)</li>
        <li>Mandy Mozart (UX &amp; Code)</li>
        <li>Jonas Pelzer (Scope Typeface)</li>
      </ul>
    </Layout>
  );
};

export default ImpressumPage;
