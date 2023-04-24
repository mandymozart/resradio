import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import dayjs from "dayjs";
import { gql } from "graphql-tag";
import React from "react";
import { Link, useParams } from "react-router-dom";
import HeaderOffset from "../Components/HeaderOffset";
import KeyFieldParagraph from "../Components/KeyFieldParagraph";
import NotFound from "../Components/NotFound";
import PageLoader from "../Components/PageLoader";
import Tags from "../Components/Tags";
import HeroImage from "../Components/TeaserImage/HeroImage";
import { BroadcastFragment, BroadcastTagsFragement, GetBroadcastQuery } from "../Queries/broadcasts";
import PlayBig from "../images/PlayBig";

const Container = styled.div`
padding-bottom: 2rem;
`;
const Header = styled.header`
  text-align: center;
`;
const Meta = styled.div`
  text-align: center;
`;

const Description = styled.section`
  font-size: 1.5rem;
  padding: 2rem 2rem;
  display: grid;
  grid-template-columns: 2fr 2fr;
  gap: 2rem;
`;

const BroadcastPagePlayer = styled.div`
  display: grid;
  grid-template-columns: 10fr 2fr;
  align-items: center; 
  gap: 2rem;
  height: 6rem;
  padding: 0 2rem;
  h3 {
    font-size: 1.5rem;
    font-family: var(--font-bold);
    margin-bottom: 0; 
    text-transform: none;
  }
  font-size: 1.5rem;
  button {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    margin: 0;
    &:hover{
      color: var(--second);
    }
  }
  .left {
    display: flex;
    align-items: center; 
  }
  .info {
    padding-left: 2rem;
  }
  .date {
    text-align: right;
  }
`

export const getBroadcastQuery = gql`
${GetBroadcastQuery}
${BroadcastFragment}
${BroadcastTagsFragement}
`
const BroadcastPage = () => {
  const { uid } = useParams();
  const { loading, error, data } = useQuery(getBroadcastQuery, { variables: { uid: uid } });

  const playBroadcast = () => {
    //
  }

  if (loading) return <PageLoader />;
  if (error) return <NotFound error={error.message} />;
  if (data?.allBroadcastss.edges <= 0) return <NotFound error={"Broadcast does not exist"} />
  const broadcast = data.allBroadcastss.edges[0].node;
  console.log(broadcast)
  return (
    <HeaderOffset>
      <Container>
        <Header>
          <HeroImage image={broadcast.image.hero ? broadcast.image.hero : broadcast.image} />
        </Header>
        <BroadcastPagePlayer broadcast={broadcast}>
          <div className="left">
            <button onClick={() => playBroadcast()}>
              <PlayBig />
            </button>
            <div className="info">
              <Link to={"../shows/" + broadcast.hostedby._meta.uid}>
                <h3>{broadcast.hostedby.title}</h3>
              </Link>
              <div>{broadcast.title}</div>
            </div>
          </div>
          <div className="date">
            {dayjs(broadcast.begin).format("DD.MM.YYYY")}<br />
            {dayjs(broadcast.begin).format("h")}&mdash;{dayjs(broadcast.end).format("h A")}
          </div>
        </BroadcastPagePlayer>

        <Description>
          <KeyFieldParagraph text={broadcast.description} />
          <Meta>
            <Tags tags={broadcast?.tags} />
          </Meta>
        </Description>
      </Container>
    </HeaderOffset>
  );
};

export default BroadcastPage;
