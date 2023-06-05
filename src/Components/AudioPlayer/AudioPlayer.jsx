import styled from "@emotion/styled";
import React, { useEffect, useRef } from "react";
import useAudioPlayerStore from "../../Stores/AudioPlayerStore";
import useBroadcastStore from "../../Stores/BroadcastStore";
import config, { BREAKPOINT_MD, BREAKPOINT_XS } from "../../config";
import Arrow from "../../images/Arrow";
import Dot from "../../images/Dot";
import PauseBig from "../../images/PauseBig";
import PlayBig from "../../images/PlayBig";
import InlineLoader from "../InlineLoader";
import StreamShortInfo from "./StreamShortInfo";

const Container = styled.div`
padding-right: 2rem;

button {
  cursor: pointer;
}
> header {
  display: grid;
  align-items: center;
  grid-template-columns: 1fr 3fr;
  line-height: 3rem;
  @media (max-width: ${BREAKPOINT_MD}px) {
    display: flex;
  }
}

.status {
  background-color: var(--second);
  padding: 0 2rem;
  color: var(--background);
  border-right: 2px solid var(--color);
  box-sizing: border-box;
  text-transform: uppercase;
  white-space: nowrap;
  @media (max-width: ${BREAKPOINT_MD}px) {
    background-color: var(--background);
    color: var(--second);
    border-right: 0;
    padding-right: 0;
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
.player {
  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
}
`;
export const PlayButton = styled.button`
  height: 3rem;
  width: 4rem;
  display: flex;
  align-items: center;
  justify-content: end;
  padding: 0;
  @media (max-width: ${BREAKPOINT_MD}px) {
    width: 2.5rem;
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

const AudioPlayer = ({ isCollapsed, setIsCollapsed }) => {

  const { isPlaying, setIsPlaying, isLoading, setIsLoading, volume } =
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

  const onCanPlay = () => {
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
  return (
    <Container>
      <header>
        <audio
          ref={audioPlayer}
          volume={volume}
          onCanPlay={onCanPlay}
          onEnded={handleEnded}
          onError={handleError}
          src={config.STREAM_URL}
        />
        <div className="status">
          {isStreaming() ? (
            <span>
              <span className="now">Now</span>
              <span className="appendix"> Playing</span>
            </span>
          ) : (
            <>
              {isLive() ? (
                <span>
                  <Dot />
                  <span className="appendix"> Live</span>
                  <span className="now"> now</span>
                </span>
              ) : (
                <>
                  {isLoading ? (
                    <InlineLoader />
                  ) : (
                    <span>
                      Off
                      <span className="appendix">
                        line!
                      </span>
                    </span>
                  )}
                </>
              )}
            </>
          )}
        </div>
        {isStreaming() && (<>
          <div className="player">
            {isPlaying ? (
              <PlayButton onClick={() => pause()}>
                <PauseBig />
              </PlayButton>
            ) : (
              <PlayButton onClick={() => play()}>
                <PlayBig />
              </PlayButton>
            )}
            <StreamShortInfo />
            <button onClick={() => setIsCollapsed(!isCollapsed)}>
              <Arrow flipped={!isCollapsed} />
            </button>
          </div>
        </>)}
      </header>
    </Container>
  );
};

export default AudioPlayer;
