import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import React from "react";
import { useParams } from "react-router-dom";
import ShowBroadcastsList from "../Components/Broadcasts/ShowBroadcastsList";
import HeaderOffset from "../Components/HeaderOffset";
import KeyFieldParagraph from "../Components/KeyFieldParagraph";
import NotFound from "../Components/NotFound";
import PageLoader from "../Components/PageLoader";
import HeroImage from "../Components/TeaserImage/HeroImage";
import { GetShowQuery } from "../Queries/shows";

const Container = styled.div``;
const Header = styled.header`
  text-align: center;
`;
const Description = styled.section`
  font-size: 1rem;
  padding: 0 2rem;
  h3 {
    font-size: 1.5rem;
    font-family: var(--font-bold);
    margin-bottom: 1rem; 
    text-transform: none;
  }
  border-bottom: 2px solid var(--color);
  padding-bottom: 1rem;
`;

const Show = () => {
  const { uid } = useParams();
  const { loading, error, data } = useQuery(GetShowQuery, { variables: { uid: uid } });

  if (loading) return <PageLoader />;
  if (error) return <NotFound error={error.message} />;
  if (!data.shows) return <></>
  console.log(data);
  const show = data.shows;
  return (
    <HeaderOffset>
      <Container>
        <Header>
          <HeroImage image={show.image.hero} />
        </Header>
        <Description>
          <h3>{show.title}</h3>
          <KeyFieldParagraph className="text" text={show.description} />
        </Description>
        <ShowBroadcastsList id={show._meta.id} />
      </Container>
    </HeaderOffset>
  );
};

export default Show;
