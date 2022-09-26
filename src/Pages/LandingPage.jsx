import styled from "@emotion/styled";
import { useAllPrismicDocumentsByType } from "@prismicio/react";
import React, { useEffect } from "react";
import FadeIn from "../Animations/FadeIn";
import Announcement from "../Components/Announcement/Announcement";
import BroadcastSlice from "../Components/Broadcasts/BroadcastSlice";
import Button from "../Components/Button";
import Divider from "../Components/Divider";
import Layout from "../Components/Layout";
import NotFound from "../Components/NotFound";
import PageLoader from "../Components/PageLoader";
import Social from "../Components/Social/Social";
import useThemeStore from "../Stores/ThemeStore";

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
            <Hero image={document[0].data.image}>
              <h2>{document[0].data.welcome_message}</h2>
              <a
                href="mailto:program.resradio@gmail.com"
                target="_blank"
                rel="noreferrer"
              >
                <Button large>Join us</Button>
              </a>
              <Social />
            </Hero>
          </FadeIn>
          <FadeIn>
            <Announcement />
          </FadeIn>
          {document[0].data.body?.map((slice, index) => {
            if ((slice.type = "featured_broadcasts"))
              return <BroadcastSlice key={index} slice={slice} />;
            else return <></>;
          })}
          <Divider />
        </Layout>
      </>
    );
  return <>error</>;
};

export default LandingPage;
