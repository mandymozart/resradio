import styled from "@emotion/styled";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { GoPlay, GoSquareFill } from "react-icons/go";
import useAudioPlayerStore from "../../Stores/AudioPlayerStore";
import useBroadcastStore from "../../Stores/BroadcastStore";
import { BREAKPOINT_MD, BREAKPOINT_XS, STREAM_URL } from "../../config";
import Arrow from "../../images/Arrow";
import Dot from "../../images/Dot";
import DotGrey from "../../images/DotGrey";
import StreamShortInfo from "./StreamShortInfo";

const Container = styled.div`
  padding: 0 2rem;
  @media (max-width: ${BREAKPOINT_XS}px) {
    padding: 0 1rem;
  }

  border-bottom: 2px solid var(--color);

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
    @media (max-width: ${BREAKPOINT_XS}px) {
      .now {
        display: none;
      }
    }
    
    .status-indicator {
      display: flex;
      align-items: center;
      justify-content: center;
      
      &.reconnecting .pulse-dot {
        display: inline-block;
        width: 10px;
        height: 10px;
        background-color: var(--second);
        border-radius: 50%;
        animation: pulse 1.5s infinite;
      }
      
      &.offline .offline-dot {
        display: inline-block;
        width: 10px;
        height: 10px;
        background-color: var(--error, #ff5555);
        border-radius: 50%;
      }
    }
  }

  .info-container {
    flex: 1;
    overflow: hidden;
  }

  .stream-status-message {
    display: flex;
    flex-direction: column;
    padding: 0 1rem;
    overflow: hidden;
    
    .status-title {
      font-weight: bold;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .message {
      font-size: 0.8rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .retry-count {
      font-size: 0.7rem;
      color: var(--text-secondary, #888);
    }
  }

  @keyframes pulse {
    0% {
      transform: scale(0.95);
      opacity: 0.7;
    }
    50% {
      transform: scale(1.05);
      opacity: 1;
    }
    100% {
      transform: scale(0.95);
      opacity: 0.7;
    }
  }
`;

export const PlayButton = styled.button`
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: end;
  padding: 0;
  background: none;
  border: none;
  color: var(--color);
  font-size: 1.5rem;
  
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
  
  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const AudioPlayer = ({ isExpanded, setIsExpanded }) => {

  const { isPlaying, setIsPlaying, setIsLoading, isLoading, volume } =
    useAudioPlayerStore();
  const { canPlay, setCanPlay, setIsPlaying: setBroadcastIsPlaying, isStreaming, isLive } = useBroadcastStore()
  
  // Stream recovery state
  const [streamStatus, setStreamStatus] = useState('online'); // 'online', 'reconnecting', 'offline'
  const [retryCount, setRetryCount] = useState(0);
  const [offlineMessage, setOfflineMessage] = useState('');
  const [pollingInterval, setPollingInterval] = useState(null);
  const maxRetries = 60; // 5 minutes with 5-second intervals
  
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
    
    // Start stream recovery process
    startStreamRecovery();
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
  }, [isPlaying])

  const handleClick = () => { setIsExpanded(!isExpanded) }

  // Function to check if stream is back online
  const checkStreamStatus = useCallback(() => {
    // Create a temporary audio element to test the stream
    const testAudio = new Audio(STREAM_URL);
    
    // Set up event listeners
    testAudio.addEventListener('canplaythrough', () => {
      console.log('Stream is back online!');
      
      // Clear polling interval
      if (pollingInterval) {
        clearInterval(pollingInterval);
        setPollingInterval(null);
      }
      
      // Reset state
      setStreamStatus('online');
      setRetryCount(0);
      setOfflineMessage('');
      setCanPlay(true);
      
      // If player was playing when stream died, resume playback
      if (isPlaying) {
        audioPlayer.current.load();
        audioPlayer.current.play();
      }
      
      // Clean up test audio
      testAudio.src = '';
    });
    
    testAudio.addEventListener('error', () => {
      console.log(`Stream still offline. Retry attempt: ${retryCount + 1}/${maxRetries}`);
      
      // Increment retry count
      const newRetryCount = retryCount + 1;
      setRetryCount(newRetryCount);
      
      // Check if we've reached the maximum retry attempts
      if (newRetryCount >= maxRetries) {
        // Stream has been offline for too long, update status
        setStreamStatus('offline');
        setOfflineMessage('The station is currently offline. We will resume playback automatically when broadcasting resumes.');
        
        // Clear polling interval
        if (pollingInterval) {
          clearInterval(pollingInterval);
          setPollingInterval(null);
        }
      }
      
      // Clean up test audio
      testAudio.src = '';
    });
    
    // Start loading to trigger events
    testAudio.load();
  }, [isPlaying, pollingInterval, retryCount, maxRetries]);

  // Function to start the stream recovery process
  const startStreamRecovery = useCallback(() => {
    // Set initial state
    setStreamStatus('reconnecting');
    setRetryCount(0);
    setOfflineMessage('Attempting to reconnect to the stream...');
    
    // Clear any existing polling interval
    if (pollingInterval) {
      clearInterval(pollingInterval);
    }
    
    // Start polling to check if stream comes back online
    const interval = setInterval(checkStreamStatus, 5000); // Check every 5 seconds
    setPollingInterval(interval);
    
    // Run an immediate check
    checkStreamStatus();
    
    // Clean up function
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [checkStreamStatus, pollingInterval]);

  // Cleanup polling interval when component unmounts
  useEffect(() => {
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [pollingInterval]);

  return (
    <Container>
      <header>
        <audio
          ref={audioPlayer}
          volume={volume}
          onCanPlayThrough={onCanPlayThrough}
          onEnded={handleEnded}
          onError={handleError}
          src={STREAM_URL}
        />
        <div className="status">
          {canPlay && streamStatus === 'online' ? (
            isLive() ? (<Dot />) : (<>{isStreaming() && (<DotGrey />)}</>)
          ) : (
            <span className={`status-indicator ${streamStatus}`}>
              {streamStatus === 'reconnecting' ? (
                <span className="pulse-dot"></span>
              ) : (
                <span className="offline-dot"></span>
              )}
            </span>
          )}
        </div>
        
        {canPlay && streamStatus === 'online' ? (
          <PlayButton onClick={isPlaying ? pause : play}>
            {isPlaying ? <GoSquareFill /> : <GoPlay />}
          </PlayButton>
        ) : (
          <PlayButton disabled className="disabled">
            <GoPlay />
          </PlayButton>
        )}
        
        {/* Always show StreamShortInfo, but with different content when offline */}
        <div className="info-container">
          {streamStatus === 'online' ? (
            <StreamShortInfo onClick={handleClick} />
          ) : (
            <div className="stream-status-message">
              <div className="status-title">
                {streamStatus === 'reconnecting' ? 'Reconnecting...' : 'Station Offline'}
              </div>
              <div className="message">{offlineMessage}</div>
              {streamStatus === 'reconnecting' && (
                <div className="retry-count">Attempt {retryCount}/{maxRetries}</div>
              )}
            </div>
          )}
        </div>
        
        <button onClick={handleClick}>
          <Arrow flipped={!isExpanded} />
        </button>
      </header>
    </Container>
  );
};

export default AudioPlayer;
