import styled from "@emotion/styled";
import React, { useRef, useState } from "react";
import { isDesktop } from "react-device-detect";
import {
  BsPause,
  BsPlay,
  BsVolumeDown,
  BsVolumeMute,
  BsVolumeUp
} from "react-icons/bs";
import config from "../../config";
import useAudioPlayerStore from "../../Stores/AudioPlayerStore";
import Loader from "../Loader";
import BroadcastInfo from "./BroadcastInfo";

const Container = styled.div`
  > div {
    display: flex;
    align-items: center;
  }
`;
const ControlButton = styled.button`
  color: var(--color);
  border: 0;
  border-radius: 0.25rem;
  height: 3rem;
  padding: 0 2rem;
  cursor: pointer;
  font-weight: bold;
  line-height: 0.75rem;
  &:hover {
    color: var(--second);
  }
`;
const PlayButton = styled(ControlButton)`
  position: relative;
  padding: 0;
  padding: 0;
  background: transparent;
  font-size: 1.5rem;
`;
const VolumeButton = styled(PlayButton)``;

const VolumeSlider = styled.div`
  position: absolute;
  top: 3rem;
  input {
    writing-mode: bt-lr; /* IE */
    -webkit-appearance: slider-vertical; /* WebKit */
    width: 1rem;
    height: 6rem;
    padding: 0 0.25rem;
  }
`;

const AudioPlayer = () => {
  const [volume, setVolume] = useState(0.5);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const volumeSlider = useRef();
  const audioPlayer = useRef();
  // const source = useRef();
  // const [track, setTrack] = useState(config.STREAM_URL);
  const { isPlaying, setIsPlaying, isLoading, setIsLoading } =
    useAudioPlayerStore();

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
  const toggleVolumeSlider = () => {
    setShowVolumeSlider(!showVolumeSlider);
  };
  const changeVolume = (e) => {
    setVolume(e.target.value);
    audioPlayer.current.volume = e.target.value;
  };

  const onPlaying = (e) => {
    // TODO: visualisation
  };

  const handleEnded = () => {
    // TODO: set next track in playlist
  }

  const onCanPlay = () => {
    setIsLoading(false);
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
        onEnded={handleEnded}
        src={config.STREAM_URL}
      />
      {isDesktop && (
        <>
          <VolumeButton onClick={toggleVolumeSlider}>
            {volume <= 0 && <BsVolumeMute />}
            {volume > 0 && volume < 0.6 && <BsVolumeDown />}
            {volume >= 0.6 && <BsVolumeUp />}
          </VolumeButton>

          {showVolumeSlider && (
            <VolumeSlider>
              <input
                orient="vertical"
                type="range"
                max="1"
                min="0"
                value={volume}
                step="0.01"
                ref={volumeSlider}
                onChange={changeVolume}
              />
            </VolumeSlider>
          )}
        </>
      )}

      <PlayButton onClick={togglePlay}>
        {isLoading ? (
          <Loader size={15} />
        ) : (
          <>{isPlaying ? <BsPause /> : <BsPlay />}</>
        )}
      </PlayButton>
      </header>
      <BroadcastInfo/>
    </Container>
  );
};

export default AudioPlayer;
