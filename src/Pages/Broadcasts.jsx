import React, { useEffect } from "react";
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
      <BroadcastList tag="techno"/>
      <Divider/>
      <BroadcastList tag="ambient"/>
    </Layout>
  );
};

export default Broadcasts;
