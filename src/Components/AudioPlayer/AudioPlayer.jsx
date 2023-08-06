import styled from "@emotion/styled";
import React, { useEffect, useRef } from "react";
import { GoPlay, GoSquareFill } from "react-icons/go";
import useAudioPlayerStore from "../../Stores/AudioPlayerStore";
import useBroadcastStore from "../../Stores/BroadcastStore";
import config, { BREAKPOINT_MD, BREAKPOINT_XS } from "../../config";
import Arrow from "../../images/Arrow";
import Dot from "../../images/Dot";
import DotGrey from "../../images/DotGrey";
import StreamShortInfo from "./StreamShortInfo";

const Container = styled.div`
padding: 0 2rem;
@media (max-width: ${BREAKPOINT_XS}px) {
  padding: 0 1rem;
}

button {
  cursor: pointer;
}
> header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
  gap: 0rem;
  line-height: 3rem;
  @media (max-width: ${BREAKPOINT_MD}px) {
    display: flex;
  } 
}

.status {
  color: var(--second);
  box-sizing: border-box;
  text-transform: uppercase;
  white-space: nowrap;
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
  svg {
    height: 1.25rem;
    width: 1.25rem;
  }
  @media (max-width: ${BREAKPOINT_MD}px) {
    .appendix {
      display: none;
    }
  }
  @media (max-width: ${BREAKPOINT_MD}px) {
    .appendix {
      display: none;
    }
  }
  @media (max-width: ${BREAKPOINT_XS}px) {
    .now {
      display: none;
    }
  }
}
`;
export const PlayButton = styled.button`
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: end;
  padding: 0;
  @media (max-width: ${BREAKPOINT_MD}px) {
    justify-content: flex-start;
  }
  @media (max-width: ${BREAKPOINT_XS}px) {
    width: 2rem;
  }
  svg {
    width: 2rem;
    height: 1.5rem;
  }
`;

const AudioPlayer = ({ isExpanded, setIsExpanded }) => {

  const { isPlaying, setIsPlaying, setIsLoading, isLoading, volume } =
    useAudioPlayerStore();
  const { canPlay, setCanPlay, setIsPlaying: setBroadcastIsPlaying, isStreaming, isLive } = useBroadcastStore()

  let audioPlayer = useRef();

  const play = () => {
    setIsPlaying(true)
    setBroadcastIsPlaying(false)
    audioPlayer.current.play();
  }

  const pause = () => {
    setIsPlaying(false);
    audioPlayer.current.pause();
  }

  const handleEnded = () => {
    console.warn('Audio Stream ended.')
    setCanPlay(false);
  }

  const handleError = (e) => {
    console.warn('No Stream available', e.target.error)
    setIsLoading(false)
    setCanPlay(false);
  }

  const onCanPlayThrough = () => {
    setCanPlay(true);
    setIsLoading(false);
    audioPlayer.current.volume = volume;
  };

  useEffect(() => {
    audioPlayer.current.volume = volume;
  }, [volume])

  useEffect(() => {
    if (!isPlaying) {
      pause()
    }
  }
    , [isPlaying])

  const handleClick = () => { setIsExpanded(!isExpanded) }

  return (
    <Container>
      <header>
        <audio
          ref={audioPlayer}
          volume={volume}
          onCanPlayThrough={onCanPlayThrough}
          onEnded={handleEnded}
          onError={handleError}
          src={config.STREAM_URL}
        />
        {canPlay ? (<>
          <div className="status">
            {isLive() && (<Dot />)}
            {isStreaming() && (<DotGrey />)}
          </div>
          {isPlaying ? (
            <PlayButton onClick={() => pause()}>
              <GoSquareFill />
            </PlayButton>
          ) : (
            <PlayButton onClick={() => play()}>
              <GoPlay />
            </PlayButton>
          )}
          <StreamShortInfo />
          <button onClick={handleClick}>
            <Arrow flipped={!isExpanded} />
          </button>
        </>) : (<>Offline</>)}
      </header>
    </Container>
  );
};

export default AudioPlayer;
