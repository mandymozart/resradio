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
      <h3>This page is made with contributions by:</h3>
      <ul>
        <li>Lena Thomaka (Design Advisor)</li>
        <li>Vero ... (Product Owner)</li>
        <li>Reimundo ... (Product Owner)</li>
        <li>Chris ... (Product Owner)</li>
        <li>Marcel &amp; ... (Design Concept)</li>
        <li>Mandy Mozart (UX &amp; Code)</li>
        <li>Sabine ... (Management)</li>
        <li>Jonas Pelzer (Scope Typeface)</li>
      </ul>
    </Layout>
  );
};

export default ImpressumPage;
