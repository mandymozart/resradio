import React from 'react';
import { GoPlay, GoSquareFill } from 'react-icons/go';
import { PlayButton as StyledPlayButton } from '../styles/AudioPlayerStyles';

/**
 * Component for the play/pause button
 */
const PlayButton = ({ canPlay, streamStatus, isPlaying, onPlay, onPause }) => {
  const handleClick = () => {
    if (canPlay && streamStatus === 'online') {
      if (isPlaying) {
        onPause();
      } else {
        onPlay();
      }
    }
  };

  return (
    <StyledPlayButton
      onClick={handleClick}
      disabled={!canPlay || streamStatus !== 'online'}
      className={!canPlay || streamStatus !== 'online' ? 'disabled' : ''}>
      {isPlaying ? <GoSquareFill /> : <GoPlay />}
    </StyledPlayButton>
  );
};

export default PlayButton;