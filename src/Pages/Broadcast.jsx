import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import dayjs from "dayjs";
import React, { useState } from "react";
import { useIdentityContext } from "react-netlify-identity";
import ReactMarkdown from 'react-markdown';
import { Link, useParams } from "react-router-dom";
import KeyFieldParagraph from "../Components/KeyFieldParagraph";
import NotFound from "../Components/NotFound";
import PageLoader from "../Components/PageLoader";
import Tags from "../Components/Tags";
import HeroImage from "../Components/TeaserImage/HeroImage";
import { getBroadcastQuery } from "../Queries/broadcasts";
import useAudioPlayerStore from "../Stores/AudioPlayerStore";
import useBroadcastStore from "../Stores/BroadcastStore";
import { BREAKPOINT_MD, BREAKPOINT_XS, DATE_FORMAT_LONG, FUNCTIONS } from "../config";
import PauseBig from "../images/PauseBig";
import PlayBig from "../images/PlayBig";
import ScheduledBig from "../images/ScheduledBig";
import { getTimeRangeString } from "../utils";

const Container = styled.div`
`;
const Header = styled.header`
  text-align: center;
`;
const Meta = styled.div`
  text-align: right;
  padding-top: 2rem;
  &&& > .rtl {
  @media (max-width: ${BREAKPOINT_MD}px) {
    text-align: left;
  }
}
`;

const Description = styled.section`
  font-size: 1.5rem;
  margin-top: 3rem;
  padding: 2rem;
  display: grid;
  grid-template-columns: 2fr 2fr;
  @media (max-width: ${BREAKPOINT_MD}px) {
    display: flex;
    flex-direction: column-reverse;
  }
  @media (max-width: ${BREAKPOINT_XS}px) {
    font-size: 1rem;
    padding: 1rem;
    margin-top: 1rem;
  }
  gap: 2rem;
`;

const BroadcastPagePlayer = styled.div`

  padding: 0 2rem 0 1rem;
  h3 {
    font-size: 1.5rem;
    font-family: var(--font-bold);
    margin-bottom: 0; 
    text-transform: none;
  }
  font-size: 1.5rem;
  .controls {
    padding-top: 2rem;
    margin-right: 1rem;
    @media (max-width: ${BREAKPOINT_MD}px) {
      margin-right: 1rem;
    }
    @media (max-width: ${BREAKPOINT_XS}px) {
      margin-right: 0;
    }
  }
  button {
    background: none;
    border: none;
    padding: 0;
    color: var(--color);
    cursor: pointer;
    margin: 0;
    text-align: center;
    align-items: top;
    &:hover{
      color: var(--second);
    }
  }
  .left {
    display: flex;
    align-items: top; 
    justify-content: space-between;
    @media (max-width: ${BREAKPOINT_MD}px) {
      display: block;
      padding: 0 1rem;
    }
    @media (max-width: ${BREAKPOINT_XS}px) {
      padding: 0;
    }
  }
  .info {
    flex: 1;
    display: flex;
    h3 {
      margin-top: 2rem;
    }
  }

  .date {
    font-size: 1rem;
    margin-top: .25rem;
    @media (max-width: ${BREAKPOINT_XS}px) {
      padding-bottom: 0;
    }
  }
`

const BroadcastPage = () => {
  const { uid } = useParams();

  const { isLoggedIn } = useIdentityContext()

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
          <div className="info">
            <div className="controls">
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
                  <ScheduledBig />
                </button>
              )}
            </div>
            <div>
              <h3><Link to={"../shows/" + broadcast.hostedby._meta.uid}>{broadcast.hostedby.title}</Link>&mdash;{broadcast.title}</h3>
              <div className="date">
                {dayjs(broadcast.begin).format(DATE_FORMAT_LONG)}<br />
                {getTimeRangeString(broadcast.begin, broadcast.end)}
                {isLoggedIn && <><br />Plays:
                  {playbacks ? <> {playbacks}</> : <> <button onClick={() => getPlaybacks()}>Get play count</button></>}
                </>}
              </div>
            </div>
          </div>
          <Meta>
            <Tags tags={broadcast?._meta.tags} className="tags" rtl />
          </Meta>
        </div>
      </BroadcastPagePlayer>

      <Description>
        {broadcast.description ? (<div>
          <ReactMarkdown>{broadcast.description}</ReactMarkdown>
        </div>
        ) : (
          <div></div>
        )}
      </Description>
    </Container>
  );
};

export default BroadcastPage;
