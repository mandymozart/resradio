import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import React from "react";
import { useParams } from "react-router-dom";
import FadeIn from "../Animations/FadeIn";
import HeaderOffset from "../Components/HeaderOffset";
import KeyFieldParagraph from "../Components/KeyFieldParagraph";
import PageLoader from "../Components/PageLoader";
import HeroImage from "../Components/TeaserImage/HeroImage";
import { GetShowQuery } from "../Queries/shows";

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
  const { loading, error, data } = useQuery(GetShowQuery, { variables: { uid: uid } });

  if (loading) return <PageLoader />;
  if (error) return <>Error : {error.message}</>;
  if (data.allShowss.edges <= 0) return <></>
  console.log(data);
  const show = data.allShowss.edges[0].node;
  return (
    <HeaderOffset>
      <Container>
        <Header>
          <FadeIn>
            <HeroImage image={show.image.hero} />
          </FadeIn>
        </Header>
        <Description>
          <FadeIn>
            <h3>{show.title}</h3>
          </FadeIn>
          <FadeIn>
            <KeyFieldParagraph text={show.description} />
          </FadeIn>
        </Description>
      </Container>
    </HeaderOffset>
  );
};

export default Show;
