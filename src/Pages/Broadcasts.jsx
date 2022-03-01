import { usePrismicClient } from "@prismicio/react";
import React, { useEffect } from "react";
import FadeIn from "../Animations/FadeIn";
import BroadcastList from "../Components/Broadcasts/BroadcastList";
import Divider from "../Components/Divider";
import Layout from "../Components/Layout";
import useBroadcastStore from "../Stores/BroadcastStore";
import useThemeStore from "../Stores/ThemeStore";

const Broadcasts = () => {
  const setKeyword = useThemeStore((store) => store.setKeyword);
  const client = usePrismicClient();
  const { tags } = client.getTags();
  const { broadcasts, currentBroadcast } = useBroadcastStore();
  useEffect(() => {
    setKeyword("broadcast");
  }, [setKeyword]);
  useEffect(() => {
    console.log(tags)
  },[tags])
  return (
    <Layout>
      <FadeIn>
        <h2>Our broadcasts</h2>
      </FadeIn>
      <FadeIn>
        <p>
          Feel free to browse and replay your
          favorite shows.
        </p>
      </FadeIn>
      <Divider />
      {tags?.map((tag, index) => (
        <>
          <BroadcastList key={index} tag={tag} />
          <Divider />
        </>
      ))}
    </Layout>
  );
};

export default Broadcasts;
