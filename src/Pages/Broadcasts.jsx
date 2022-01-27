import React, { useEffect } from "react";
import FadeIn from "../Animations/FadeIn";
import BroadcastList from "../Components/Broadcasts/BroadcastList";
import Divider from "../Components/Divider";
import Layout from "../Components/Layout";
import useBroadcastStore from "../Stores/BroadcastStore";
import useThemeStore from "../Stores/ThemeStore";

const Broadcasts = () => {
  const setKeyword = useThemeStore((store) => store.setKeyword);
  const { broadcasts, currentBroadcast} = useBroadcastStore()
  useEffect(() => {
    setKeyword("broadcast");
  }, [setKeyword]);
  return (
    <Layout>
      <FadeIn>
        <h2>Missed out on a past broadcast?</h2>
      </FadeIn>
      <FadeIn>
        <p>We collect all show on soundcloud. Feel free to browse and replay your favorite shows.</p>
      </FadeIn>
      <Divider/>
      <BroadcastList tag="techno"/>
      <Divider/>
      <BroadcastList tag="ambient"/>
    </Layout>
  );
};

export default Broadcasts;
