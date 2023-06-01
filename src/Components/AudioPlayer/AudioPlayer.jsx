import styled from "@emotion/styled";
import React, { useEffect, useRef } from "react";
import useAudioPlayerStore from "../../Stores/AudioPlayerStore";
import useBroadcastStore from "../../Stores/BroadcastStore";
import config from "../../config";
import Arrow from "../../images/Arrow";
import Dot from "../../images/Dot";
import PauseBig from "../../images/PauseBig";
import PlayBig from "../../images/PlayBig";
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
}

.status {
  background-color: var(--second);
  padding: 0 2rem;
  color: var(--background);
  border-right: 2px solid var(--color);
  box-sizing: border-box;
  text-transform: uppercase;
  white-space: nowrap;
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
  svg {
    width: 2rem;
    height: 1.5rem;
  }
`;

const AudioPlayer = ({ isCollapsed, setIsCollapsed }) => {

  const { isPlaying, setIsPlaying, isLoading, setIsLoading, volume } =
    useAudioPlayerStore();
  const { isPlaying: broadcastIsPlaying, setIsPlaying: setBroadcastIsPlaying, isStreaming } = useBroadcastStore()

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
    // TODO: set next track in playlist
    console.warn('Audio Stream ended.')
  }

  const onCanPlay = () => {
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
  console.log(isStreaming())
  return (
    <Container>
      <header>
        <audio
          ref={audioPlayer}
          volume={volume}
          onCanPlay={onCanPlay}
          onEnded={handleEnded}
          src={config.STREAM_URL}
        />
        <div className="status">
          {isStreaming() ? (
            <span className="now">Now Playing</span>
          ) : (
            <span className="now"><Dot /> Live now</span>
          )}
        </div>
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
          {isStreaming() && (
            <button onClick={() => setIsCollapsed(!isCollapsed)}>
              <Arrow flipped={!isCollapsed} />
            </button>
          )}
        </div>
      </header>
    </Container>
  );
};

export default AudioPlayer;
