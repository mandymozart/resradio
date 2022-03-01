import styled from "@emotion/styled";
import { useAllPrismicDocumentsByUIDs } from "@prismicio/react";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import FadeIn from "../Animations/FadeIn";
import KeyFieldParagraph from "../Components/KeyFieldParagraph";
import Layout from "../Components/Layout";
import NotFound from "../Components/NotFound";
import PageLoader from "../Components/PageLoader";
import Tags from "../Components/Tags";
import TeaserImage from "../Components/TeaserImage/TeaserImage";
import Timeslots from "../Components/Timeslots/Timeslots";
import useThemeStore from "../Stores/ThemeStore";

const Container = styled.div``;
const Header = styled.header`
  text-align: center;
`;
const Meta = styled.div`
  text-align: center;
`;

const Description = styled.section``;
const Event = () => {
  const { uid } = useParams();
  const setKeyword = useThemeStore((store) => store.setKeyword);
  const [document, { state, error }] = useAllPrismicDocumentsByUIDs("events", 
    [uid],
    {
      fetchLinks: "relatedshow.title",
    },
  );

  useEffect(() => {
    if (document) setKeyword(document[0].data.keyword);
  }, [setKeyword]);

  if (state === "loading") return <PageLoader />;
  else if (state === "failed") return <NotFound />;
  else if (state === "loaded" && document[0])
    return (
      <Layout>
        <Container>
          <FadeIn>
            <Header>
              <TeaserImage image={document[0].data.image} />
            </Header>
          </FadeIn>
          <FadeIn>
            <Meta>
              <Tags tags={document[0].data?.tags} />
            </Meta>
          </FadeIn>
          <Description>
            <FadeIn>
              <h3>{document[0].data?.title}</h3>
            </FadeIn>
            <FadeIn>
              <KeyFieldParagraph text={document[0].data.description} />
            </FadeIn>
          </Description>
          {document[0].data.body?.map((timeslots, index) => (
            <Timeslots key={`timeslot${index}`} timeslots={timeslots} />
          ))}
        </Container>
      </Layout>
    );
  else return <NotFound />;
};

export default Event;
