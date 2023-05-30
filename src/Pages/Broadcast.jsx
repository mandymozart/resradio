import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import dayjs from "dayjs";
import React, { useState } from "react";
import { useIdentityContext } from "react-netlify-identity";
import { Link, useParams } from "react-router-dom";
import KeyFieldParagraph from "../Components/KeyFieldParagraph";
import NotFound from "../Components/NotFound";
import PageLoader from "../Components/PageLoader";
import Tags from "../Components/Tags";
import HeroImage from "../Components/TeaserImage/HeroImage";
import { getBroadcastQuery } from "../Queries/broadcasts";
import useAudioPlayerStore from "../Stores/AudioPlayerStore";
import useBroadcastStore from "../Stores/BroadcastStore";
import { BREAKPOINT_MD, BREAKPOINT_XS, DATE_FORMAT, FUNCTIONS } from "../config";
import PauseBig from "../images/PauseBig";
import PlayBig from "../images/PlayBig";
import Scheduled from "../images/Schedule";
import { getTimeRangeString } from "../utils";

const Container = styled.div`
padding-bottom: 2rem;
`;
const Header = styled.header`
  text-align: center;
`;
const Meta = styled.div`
  text-align: center;
  @media (max-width: ${BREAKPOINT_MD}px) {
    &&& > .rtl {
      text-align: left;
    }
  }
  
`;

const Description = styled.section`
  font-size: 1.5rem;
  padding: 2rem 2rem;
  display: grid;
  grid-template-columns: 2fr 2fr;
  @media (max-width: ${BREAKPOINT_MD}px) {
    display: flex;
    flex-direction: column-reverse;
  }
  gap: 2rem;
`;

const BroadcastPagePlayer = styled.div`
  display: grid;
  grid-template-columns: 10fr 2fr;
  @media (max-width: ${BREAKPOINT_XS}px) {
      grid-template-columns: 1fr;
  }
  align-items: center; 
  gap: 2rem;
  min-height: 6rem;
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
    color: var(--color);
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
    @media (max-width: ${BREAKPOINT_XS}px) {
      text-align: left;
      padding: 0 2rem;
    }
  }
`

const BroadcastPage = () => {
  const { uid } = useParams();

  const { user, isLoggedIn } = useIdentityContext()

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

  const [playbacks, setPlaybacks] = useState(null);
  const getPlaybacks = async () => {
    const response = await fetch(`${FUNCTIONS}/get-playbacks?uid=${uid}`)
    const data = await response.json();
    setPlaybacks(data)
  }

  if (loading) return <PageLoader />;
  if (error) return <NotFound error={error.message} />;
  if (!data?.broadcasts) return <NotFound error={"Broadcast does not exist"} />
  const broadcast = data.broadcasts;
  return (
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
            <div>{broadcast.title}{isLoggedIn && <>
              {playbacks ? <> ({playbacks})</> : <><button onClick={() => getPlaybacks()}>?</button></>}
            </>}</div>
          </div>
        </div>
        <div className="date">
          {dayjs(broadcast.begin).format(DATE_FORMAT)}<br />
          {getTimeRangeString(broadcast.begin, broadcast.end)}
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
  );
};

export default BroadcastPage;
