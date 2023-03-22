import styled from "@emotion/styled";
import { useAllPrismicDocumentsByUIDs } from "@prismicio/react";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import FadeIn from "../Animations/FadeIn";
import KeyFieldParagraph from "../Components/KeyFieldParagraph";
import Layout from "../Components/Layout";
import NotFound from "../Components/NotFound";
import PageLoader from "../Components/PageLoader";
import HeroImage from "../Components/TeaserImage/HeroImage";
import useThemeStore from "../Stores/ThemeStore";

const Container = styled.div``;
const Header = styled.header`
  text-align: center;
`;
const Meta = styled.div`
  text-align: center;
  padding: 1rem;
`;

export const SoundcloudPlayer = styled.div`
  position: relative;
  overflow: hidden;
  width: 100%;
  margin-top: 1rem;
  padding-top: 56.25%;
  iframe {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 100%;
  }
`;

const Description = styled.section`
  font-size: 1rem;
`;

const Show = () => {
  const { uid } = useParams();
  const setKeyword = useThemeStore((store) => store.setKeyword);

  const [document, { state }] = useAllPrismicDocumentsByUIDs("shows", [uid]);
  useEffect(() => {
    if (document) setKeyword(document[0].data.keyword);
  }, [setKeyword]);

  if (state === "loading") return <PageLoader />;
  else if (state === "failed") return <NotFound />;
  else if (state === "loaded" && document[0])
    return (
      <Layout>
        <Container>
          <Header>
            <FadeIn>
              <HeroImage image={document[0].data.image.hero} />
            </FadeIn>
            {document[0].data?.soundcloud.html && (
              <FadeIn>
                <SoundcloudPlayer
                  dangerouslySetInnerHTML={{
                    __html: document[0].data.soundcloud.html,
                  }}
                />
              </FadeIn>
            )}
          </Header>
          <Description>
            <FadeIn>
              <h3>{document[0].data.title}</h3>
            </FadeIn>
            <FadeIn>
              <KeyFieldParagraph text={document[0].data.description} />
            </FadeIn>
          </Description>
        </Container>
      </Layout>
    );
  return <NotFound />;
};

export default Show;
