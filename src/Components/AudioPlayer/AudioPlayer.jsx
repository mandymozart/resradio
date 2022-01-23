import styled from "@emotion/styled";
import React, { useRef, useState } from "react";
import { isDesktop } from "react-device-detect";
import {
  BsFillPlayFill,
  //   BsFillVolumeOffFill,
  BsFillVolumeDownFill,
  BsFillVolumeMuteFill,
  BsFillVolumeUpFill,
  BsPause
} from "react-icons/bs";

const Container = styled.div`
  display: flex;
  padding-left: 1rem;
`;
const Button = styled.button`
  color: var(--color);
  border: 0;
  border-radius: 0.25rem;
  height: 3rem;
  padding: 0 2rem;
  cursor: pointer;
  font-weight: bold;
  line-height: 0.75rem;
`;
const PlayButton = styled(Button)`
  position: relative;
  padding: 0;
  padding: 0;
  background: transparent;
  font-size: 2rem;
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
  const [volume, setVolume] = useState(0.7);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const volumeSlider = useRef();
  const audioPlayer = useRef();
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    isPlaying ? audioPlayer.current.pause() : audioPlayer.current.play();
    setIsPlaying(!isPlaying);
  };
  const toggleVolumeSlider = () => {
    setShowVolumeSlider(!showVolumeSlider);
  };
  const changeVolume = (e) => {
    setVolume(e.target.value);
    audioPlayer.current.volume = e.target.value;
  };

  return (
    <Container>
      <audio ref={audioPlayer} id="audioPlayer" preload="auto">
        <source src="https://edge.mixlr.com/channel/zwtuo"></source>
      </audio>
      {isDesktop && (
        <>
          <VolumeButton onClick={toggleVolumeSlider}>
            {volume === 0 && <BsFillVolumeMuteFill />}
            {volume > 0 && volume < 0.6 && <BsFillVolumeDownFill />}
            {volume >= 0.6 && <BsFillVolumeUpFill />}
          </VolumeButton>

          {showVolumeSlider && (
            <VolumeSlider>
              <input
                orient="vertical"
                type="range"
                max="1"
                min="0"
                step="0.01"
                ref={volumeSlider}
                onChange={changeVolume}
                defaultValue="0.7"
              />
            </VolumeSlider>
          )}
        </>
      )}

      <PlayButton onClick={togglePlay}>
        {isPlaying ? <BsPause /> : <BsFillPlayFill />}
      </PlayButton>
    </Container>
  );
};

export default AudioPlayer;
