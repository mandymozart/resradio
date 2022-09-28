import styled from "@emotion/styled";
import { useAllPrismicDocumentsByUIDs } from "@prismicio/react";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import FadeIn from "../Animations/FadeIn";
import KeyFieldParagraph from "../Components/KeyFieldParagraph";
import Layout from "../Components/Layout";
import NotFound from "../Components/NotFound";
import PageLoader from "../Components/PageLoader";
import TeaserImage from "../Components/TeaserImage/TeaserImage";
import useThemeStore from "../Stores/ThemeStore";

const Container = styled.div``;
const Header = styled.header`
  text-align: center;
`;
const Meta = styled.div`
  text-align: center;
`;

const Description = styled.section``;
const Page = () => {
  const { uid } = useParams();
  const setKeyword = useThemeStore((store) => store.setKeyword);
  const [document, { state, error }] = useAllPrismicDocumentsByUIDs("page", [
    uid,
  ]);

  useEffect(() => {
    if (document) setKeyword(document[0].data.keyword);
  }, [setKeyword]);
  console.log(state);
  if (state === "loading") return <PageLoader />;
  else if (state === "failed") return <NotFound />;
  else if (state === "loaded" && document[0])
    return (
      <Layout>
        <Container>
          {document[0].data.image && (
            <FadeIn>
              <Header>
                <TeaserImage image={document[0].data.image} />
              </Header>
            </FadeIn>
          )}
          <Description>
            <FadeIn>
              <h3>{document[0].data?.title}</h3>
            </FadeIn>
            <FadeIn>
              <KeyFieldParagraph text={document[0].data.text} />
            </FadeIn>
          </Description>
        </Container>
      </Layout>
    );
  else return <NotFound />;
};

export default Page;
