import styled from "@emotion/styled";
import { useAllPrismicDocumentsByUIDs } from "@prismicio/react";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import KeyFieldParagraph from "../Components/KeyFieldParagraph";
import Layout from "../Components/Layout";
import NotFound from "../Components/NotFound";
import PageLoader from "../Components/PageLoader";
import Tags from "../Components/Tags";
import TeaserImage from "../Components/TeaserImage/TeaserImage";
import useThemeStore from "../Stores/ThemeStore";

const Container = styled.div``;
const Header = styled.header`
  text-align: center;
`;
const Meta = styled.div`
  text-align: center;
  padding: 1rem;
`;

const Player = styled.div`
  position: relative;
  overflow: hidden;
  width: 100%;
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
            <TeaserImage image={document[0].data.image} />
            {document[0].data?.soundcloud.html && (
              <Player
                dangerouslySetInnerHTML={{
                  __html: document[0].data.soundcloud.html,
                }}
              />
            )}
          </Header>
          <Meta>
            <Tags tags={document[0].data.tags} />
          </Meta>
          <Description>
            <h3>{document[0].data.title}</h3>
            <KeyFieldParagraph text={document[0].data.description} />
          </Description>
        </Container>
      </Layout>
    );
  return <NotFound />;
};

export default Show;
