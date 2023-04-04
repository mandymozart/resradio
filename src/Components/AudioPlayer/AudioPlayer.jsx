import styled from "@emotion/styled";
import React, { useEffect, useRef } from "react";
import config from "../../config";
import useIsMounted from "../../Hooks/isMounted";
import Arrow from "../../images/Arrow";
import Pause from "../../images/Pause";
import Play from "../../images/Play";
import useAudioPlayerStore from "../../Stores/AudioPlayerStore";
import Loader from "../Loader";
import StreamShortInfo from "./StreamShortInfo";

const Container = styled.div`
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

`;

const AudioPlayer = ({ isCollapsed, setIsCollapsed }) => {

  const isMounted = useIsMounted();

  // const source = useRef();
  // const [track, setTrack] = useState(config.STREAM_URL);
  const { isPlaying, setIsPlaying, isLoading, setIsLoading, volume, setVolume } =
    useAudioPlayerStore();

  let audioPlayer = useRef();

  const togglePlay = () => {
    if (isPlaying) {
      audioPlayer.current.pause();
      setIsPlaying(false)
    } else {
      // setTrack(config.STREAM_URL);
      setIsPlaying(true)
      audioPlayer.current.play();
    }
  };


  const onPlaying = (e) => {
    // TODO: update progress in control bar
  };

  const handleEnded = () => {
    // TODO: set next track in playlist
    console.warn('Audio Stream ended.')
  }

  const onCanPlay = () => {
    setIsLoading(false);
    audioPlayer.current.volume = volume;
  };

  const handleVolumeChange = (e) => {
    // setVolume(e.value)
    audioPlayer.current.volume = e.value;
  }


  useEffect(() => {
    if (isMounted) window.addEventListener('volumeChanged', handleVolumeChange)
  }, [isMounted])



  return (
    <Container>
      <header>
        <audio
          ref={audioPlayer}
          volume={volume}
          onTimeUpdate={onPlaying}
          onCanPlay={onCanPlay}
          onEnded={handleEnded}
          src={config.STREAM_URL}
        />

        <PlayButton onClick={togglePlay}>
          {isLoading ? (
            <Loader size={15} />
          ) : (
            <>{isPlaying ? <Pause /> : <Play />}</>
          )}
        </PlayButton>
        <StreamShortInfo />
        <button onClick={() => setIsCollapsed(!isCollapsed)}>
          <Arrow flipped={!isCollapsed} />
        </button>
      </header>
    </Container>
  );
};

export default AudioPlayer;
