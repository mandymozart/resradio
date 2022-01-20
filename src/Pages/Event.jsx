import styled from "@emotion/styled";
import { useAllPrismicDocumentsByUIDs } from "@prismicio/react";
import React from "react";
import { useParams } from "react-router-dom";
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

const Description = styled.section`
  font-size: 2rem;
`;
const Event = () => {
  const { uid } = useParams();
  const setKeyword = useThemeStore((store) => store.setKeyword);

  const [document, { state, error }] = useAllPrismicDocumentsByUIDs("events", [
    uid,
  ]);

  if (state === "failed") return <NotFound error={error} />;
  else if (state === "loaded") {
    if (document[0].data.keyword !== "") setKeyword(document[0].data.keyword);
    return (
      <Layout>
        <Container>
          <Header>
            {document[0].data?.image.url && (
              <TeaserImage
                image={document[0].data.image.url}
                alt={document[0].data.image.alt}
              />
            )}
          </Header>
          <Meta>
            <Tags tags={document[0].data?.tags} />
          </Meta>
          <Description>
            <h3>{document[0].data?.title}</h3>
            <KeyFieldParagraph text={document[0].data.description} />
          </Description>
          {document[0].data.body?.map((timeslots, index) => (
            <Timeslots key={`timeslot${index}`} timeslots={timeslots} />
          ))}
        </Container>
      </Layout>
    );
  }
  return <PageLoader />;
};

export default Event;
