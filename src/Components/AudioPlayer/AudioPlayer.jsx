import styled from "@emotion/styled";
import React, { useEffect, useRef } from "react";
import useIsMounted from "../../Hooks/isMounted";
import useAudioPlayerStore from "../../Stores/AudioPlayerStore";
import useBroadcastStore from "../../Stores/BroadcastStore";
import config from "../../config";
import Arrow from "../../images/Arrow";
import PauseBig from "../../images/PauseBig";
import PlayBig from "../../images/PlayBig";
import StreamShortInfo from "./StreamShortInfo";

const Container = styled.div`
button {
  cursor: pointer;
}
  > header {
    margin-right: 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;
export const ControlButton = styled.button`
&&& {

  height: 3rem;
  padding-right: 1rem;
}`;
export const PlayButton = styled(ControlButton)`
  svg {
    width: 1rem;
    height: 1rem;
  }
`;

const AudioPlayer = ({ isCollapsed, setIsCollapsed }) => {

  const isMounted = useIsMounted();

  // const source = useRef();
  // const [track, setTrack] = useState(config.STREAM_URL);
  const { isPlaying, setIsPlaying, isLoading, setIsLoading, volume } =
    useAudioPlayerStore();
  const { isPlaying: broadcastIsPlaying, setIsPlaying: setBroadcastIsPlaying } = useBroadcastStore()

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
      </header>
    </Container>
  );
};

export default AudioPlayer;
