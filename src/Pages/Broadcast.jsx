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
import { BroadcastFragment, BroadcastTagsFragment, GetBroadcastQuery } from "../Queries/broadcasts";
import useAudioPlayerStore from "../Stores/AudioPlayerStore";
import useBroadcastStore from "../Stores/BroadcastStore";
import PauseBig from "../images/PauseBig";
import PlayBig from "../images/PlayBig";
import Scheduled from "../images/Schedule";
import { DATE_FORMAT, trimZeros } from "../utils";

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
  padding: 0 2rem 0 0;
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
    width: 6rem;
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
  }
  .date {
    text-align: right;
  }
`

export const getBroadcastQuery = gql`
${GetBroadcastQuery}
${BroadcastFragment}
${BroadcastTagsFragment}
`
const BroadcastPage = () => {
  const { uid } = useParams();
  const { loading, error, data } = useQuery(getBroadcastQuery, { variables: { uid: uid } });
  const { setIsPlaying: setStreamIsPlaying } = useAudioPlayerStore()
  const { setPlaying, isPlaying, playing, setIsPlaying } = useBroadcastStore()
  const play = (uid) => {
    setPlaying(uid)
    setStreamIsPlaying(false)
    setIsPlaying(true);
  }
  const pause = () => {
    setIsPlaying(false);

  }

  if (loading) return <PageLoader />;
  if (error) return <NotFound error={error.message} />;
  if (!data?.broadcasts) return <NotFound error={"Broadcast does not exist"} />
  const broadcast = data.broadcasts;
  return (
    <HeaderOffset>
      <Container>
        <Header>
          <HeroImage image={broadcast.image.hero ? broadcast.image.hero : broadcast.image} />
        </Header>
        <BroadcastPagePlayer>
          <div className="left">
            {broadcast.audio ? (<>
              {isPlaying && playing === broadcast._meta.uid ? (
                <button onClick={() => pause()}>
                  <PauseBig />
                </button>
              ) : (
                <button onClick={() => play(broadcast._meta.uid)}>
                  <PlayBig />
                </button>
              )}
            </>
            ) : (
              <button disabled>
                <Scheduled />
              </button>
            )}
            <div className="info">
              <Link to={"../shows/" + broadcast.hostedby._meta.uid}>
                <h3>{broadcast.hostedby.title}</h3>
              </Link>
              <div>{broadcast.title}</div>
            </div>
          </div>
          <div className="date">
            {dayjs(broadcast.begin).format(DATE_FORMAT)}<br />
            {trimZeros(dayjs(broadcast.begin))}&mdash;{trimZeros(dayjs(broadcast.end))} {dayjs(broadcast.end).format("A")}
          </div>
        </BroadcastPagePlayer>

        <Description>
          {broadcast.description ? (
            <KeyFieldParagraph text={broadcast.description} />
          ) : (
            <div></div>
          )}
          <Meta>
            <Tags tags={broadcast?._meta.tags} rtl />
          </Meta>
        </Description>
      </Container>
    </HeaderOffset>
  );
};

export default BroadcastPage;
