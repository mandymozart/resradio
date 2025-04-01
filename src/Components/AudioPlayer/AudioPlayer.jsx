import React, { useCallback, useRef } from 'react';
import useBroadcastStore from '../../Stores/BroadcastStore';
import { STREAM_URL } from '../../config';
import ExpandCollapseButton from './components/ExpandCollapseButton';
import PlayButton from './components/PlayButton';
import StatusIndicator from './components/StatusIndicator';
import StreamInfo from './components/StreamInfo';
import useAudioControl from './hooks/useAudioControl';
import useStreamStatus from './hooks/useStreamStatus';
import { Container } from './styles/AudioPlayerStyles';

/**
 * Main AudioPlayer component that orchestrates all subcomponents
 */
const AudioPlayer = ({ isExpanded, setIsExpanded }) => {
  const { canPlay } = useBroadcastStore();
  const audioPlayer = useRef(null);
  
  // Custom hooks
  const {
    isPlaying,
    volume,
    play,
    pause,
    handleEnded,
    handleError,
    onCanPlayThrough
  } = useAudioControl(audioPlayer);
  
  const {
    streamStatus,
    offlineMessage,
    startStreamRecovery
  } = useStreamStatus(audioPlayer, volume, isPlaying);

  // UI event handlers
  const handleToggleExpanded = useCallback(() => {
    setIsExpanded(!isExpanded);
  }, [isExpanded, setIsExpanded]);
  
  // Extended error handler that triggers recovery
  const handleAudioError = (e) => {
    const shouldRecover = handleError(e);
    if (shouldRecover) {
      startStreamRecovery();
    }
  };

  return (
    <Container>
      <header>
        <audio
          ref={audioPlayer}
          volume={volume}
          onCanPlayThrough={onCanPlayThrough}
          onEnded={handleEnded}
          onError={handleAudioError}
          src={STREAM_URL}
        />

        {/* Status Indicator */}
        <StatusIndicator 
          canPlay={canPlay} 
          streamStatus={streamStatus}
        />

        {/* Play Button */}
        <PlayButton
          canPlay={canPlay}
          streamStatus={streamStatus}
          isPlaying={isPlaying}
          onPlay={play}
          onPause={pause}
        />

        {/* Stream Info */}
        <StreamInfo
          streamStatus={streamStatus}
          offlineMessage={offlineMessage}
          onClick={handleToggleExpanded}
        />

        {/* Expand/Collapse Button */}
        <ExpandCollapseButton 
          isExpanded={isExpanded}
          onClick={handleToggleExpanded}
        />
      </header>
    </Container>
  );
};

export default AudioPlayer;