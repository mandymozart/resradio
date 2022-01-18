import styled from "@emotion/styled";
import { useAllPrismicDocumentsByUIDs } from "@prismicio/react";
import React from "react";
import { useParams } from "react-router-dom";
import Layout from "../Components/Layout";
import NotFound from "../Components/NotFound";
import PageLoader from "../Components/PageLoader";
import Tags from "../Components/Tags";

const Container = styled.div``;
const Header = styled.header`
  text-align: center;
`;
const Meta = styled.div`
  text-align: center;
  padding: 1rem;
`;
const TeaserImage = styled.img`
  width: 100%;
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
  font-size: 1.2rem;
`;

const Show = () => {
  const { uid } = useParams();

  const [document, { state, error }] = useAllPrismicDocumentsByUIDs("shows", [
    uid,
  ]);

  if (state === "failed") return <NotFound error={error} />;
  else if (state === "loaded") {
    console.log(document[0]);
    return (
      <Layout>
        <Container>
          <Header>
            {document[0].data?.image.url && (
              <TeaserImage
                src={document[0].data.image.url}
                alt={document[0].data.image.alt}
              />
            )}
            {document[0].data?.soundcloud.html &&(
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
            {document[0].data.description}
          </Description>
        </Container>
      </Layout>
    );
  }
  return <PageLoader />;
};

export default Show;
