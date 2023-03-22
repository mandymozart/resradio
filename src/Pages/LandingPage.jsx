import styled from "@emotion/styled";
import { useAllPrismicDocumentsByType } from "@prismicio/react";
import React, { useEffect } from "react";
import { MobileView } from "react-device-detect";
import FadeIn from "../Animations/FadeIn";
import Announcement from "../Components/Announcement/Announcement";
import BroadcastSlice from "../Components/Broadcasts/BroadcastSlice";
import Footer from "../Components/Footer";
import Layout from "../Components/Layout";
import NotFound from "../Components/NotFound";
import PageLoader from "../Components/PageLoader";
import RecentShowList from "../Components/Shows/RecentShowList";
import useThemeStore from "../Stores/ThemeStore";
import Broadcasts from "./Broadcasts";
import Events from "./Events";

const Hero = styled.section`
  text-align: center;
`;

const LandingPage = () => {
  const setKeyword = useThemeStore((store) => store.setKeyword);
  const [document, { state, error }] = useAllPrismicDocumentsByType(
    "landingpage",
    { fetchLinks: "broadcasts.title" }
  );
  useEffect(() => {
    if (document) setKeyword(document[0].data.keyword);
  }, [document, setKeyword]);
  if (state === "loading") return <PageLoader />;
  else if (state === "failed") return <NotFound />;
  else if (state === "loaded" && document[0])
    return (
      <>
        <Layout>
          <FadeIn>
            <Hero>
              <img src={document[0].data.image} />
            </Hero>
          </FadeIn>
          <MobileView>
            <FadeIn>
              <Announcement />
            </FadeIn>
          </MobileView>
          {document[0].data.body?.map((slice, index) => {
            if ((slice.type = "featured_broadcasts"))
              return <BroadcastSlice key={index} slice={slice} />;
            else return <></>;
          })}
          <Events />
          <RecentShowList />
          <Broadcasts />
        </Layout>
        <Footer />
      </>
    );
  return <>error</>;
};

export default LandingPage;
