import styled from "@emotion/styled";
import React, { useRef } from "react";
import config from "../../config";
import Arrow from "../../images/Arrow";
import Pause from "../../images/Pause";
import Play from "../../images/Play";
import useAudioPlayerStore from "../../Stores/AudioPlayerStore";
import { PlayButton } from "../AudioPlayer/AudioPlayer";
import Loader from "../Loader";
import { FilterShortInfo } from "./FilterShortInfo";

const Container = styled.div`
  > header {
    margin-left: 1rem;
    display: flex;
    align-items: center;
  }
`;

const FilterPlayer = ({ isCollapsed, setIsCollapsed }) => {
  const audioPlayer = useRef();
  // const source = useRef();
  // const [track, setTrack] = useState(config.STREAM_URL);
  const { isPlayingBroadcast, setIsPlayingBroadcast, isLoadingBroadcast, setIsLoadingBroadcast, volume, setVolume } =
    useAudioPlayerStore();

  const togglePlay = () => {
    if (isPlayingBroadcast) {
      audioPlayer.current.pause();
      setIsPlayingBroadcast(false)
    } else {
      setIsPlayingBroadcast(true)
      audioPlayer.current.play();
    }
  };

  const onPlaying = () => {
    // TODO: remember last played position
  };

  const onCanPlay = () => {
    setIsLoadingBroadcast(false);
    audioPlayer.current.volume = volume;
  };

  return (
    <Container>
      <header>
        <audio
          ref={audioPlayer}
          volume={volume}
          onTimeUpdate={onPlaying}
          onCanPlay={onCanPlay}
          src={config.STREAM_URL}
        />

        <PlayButton onClick={togglePlay}>
          {isLoadingBroadcast ? (
            <Loader size={15} />
          ) : (
            <>{isPlayingBroadcast ? <Play /> : <Pause />}</>
          )}
        </PlayButton>
        <FilterShortInfo />
        <button onClick={() => setIsCollapsed(!isCollapsed)}>
          <Arrow flipped={!isCollapsed} />
        </button>
      </header>
    </Container>
  );
};

export default FilterPlayer;
