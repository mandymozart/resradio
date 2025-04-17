import { useCallback, useEffect, useRef, useState } from 'react';
import useBroadcastStore from '../../../Stores/BroadcastStore';
import { STREAM_URL } from '../../../config';

/**
 * Custom hook that manages stream status checking and recovery
 */
export default function useStreamStatus(audioPlayerRef, volume, isPlaying) {
  const { setCanPlay } = useBroadcastStore();
  
  // Stream recovery state - minimize state that causes renders
  const [streamStatus, setStreamStatus] = useState('online'); // 'online', 'reconnecting', 'offline'
  const [displayRetryCount, setDisplayRetryCount] = useState(0); // Only for display
  const [offlineMessage, setOfflineMessage] = useState('');
  
  // Use refs instead of state to avoid re-renders for internal logic
  const stateRef = useRef({
    retryCount: 0,
    maxRetries: 60,
    isPlaying: isPlaying,
    volume: volume,
    streamCheckInProgress: false,
    lastCheckTime: 0,
    maxRetriesReached: false
  });
  
  // Various refs to maintain stable references
  const pollingIntervalRef = useRef(null);
  const updateDisplayTimerRef = useRef(null);
  const safetyTimeoutRef = useRef(null);
  const testAudioRef = useRef(null);

  // Keep refs in sync with props
  useEffect(() => {
    stateRef.current.isPlaying = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    stateRef.current.volume = volume;
  }, [volume]);

  // Clean up all timeouts and intervals to prevent memory leaks
  const cleanupAll = useCallback(() => {
    // Clean up test audio
    if (testAudioRef.current) {
      testAudioRef.current.oncanplaythrough = null;
      testAudioRef.current.onerror = null;
      testAudioRef.current.src = '';
      testAudioRef.current = null;
    }
    
    // Clear all timers and intervals
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    
    if (updateDisplayTimerRef.current) {
      clearTimeout(updateDisplayTimerRef.current);
      updateDisplayTimerRef.current = null;
    }
    
    if (safetyTimeoutRef.current) {
      clearTimeout(safetyTimeoutRef.current);
      safetyTimeoutRef.current = null;
    }
    
    // Reset internal state
    stateRef.current.streamCheckInProgress = false;
  }, []);

  // Stream checking logic
  const checkStreamStatus = useCallback(() => {
    // Throttle checks to prevent excessive attempts
    const now = Date.now();
    if (stateRef.current.streamCheckInProgress) {
      return;
    }
    
    if (now - stateRef.current.lastCheckTime < 4000) {
      return;
    }

    stateRef.current.lastCheckTime = now;
    stateRef.current.streamCheckInProgress = true;

    // Clean up any existing test audio
    if (testAudioRef.current) {
      testAudioRef.current.oncanplaythrough = null;
      testAudioRef.current.onerror = null;
      testAudioRef.current.src = '';
      testAudioRef.current = null;
    }

    // Create a new test audio element
    const testAudio = new Audio();
    testAudioRef.current = testAudio;
    
    // Set up safety timeout
    safetyTimeoutRef.current = setTimeout(() => {
      stateRef.current.streamCheckInProgress = false;
      
      if (testAudioRef.current === testAudio) {
        testAudio.oncanplaythrough = null;
        testAudio.onerror = null;
        testAudio.src = '';
        testAudioRef.current = null;
      }
    }, 8000);

    // Set up event handlers
    testAudio.oncanplaythrough = function() {
      console.log('[AudioPlayer] Stream connection restored');
      clearTimeout(safetyTimeoutRef.current);
      safetyTimeoutRef.current = null;

      // Clear polling
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
      
      if (updateDisplayTimerRef.current) {
        clearTimeout(updateDisplayTimerRef.current);
        updateDisplayTimerRef.current = null;
      }

      // Reset state
      stateRef.current.retryCount = 0;
      stateRef.current.maxRetriesReached = false;
      stateRef.current.streamCheckInProgress = false;
      
      // Update UI state (triggers render)
      setStreamStatus('online');
      setDisplayRetryCount(0);
      setOfflineMessage('');
      setCanPlay(true);

      // Resume playback if needed
      if (stateRef.current.isPlaying && audioPlayerRef.current) {
        audioPlayerRef.current.load();
        audioPlayerRef.current.play().catch(() => {});
      }

      // Clean up test audio
      testAudio.oncanplaythrough = null;
      testAudio.onerror = null;
      testAudio.src = '';
      testAudioRef.current = null;
    };

    testAudio.onerror = function() {
      // Increment retry count without state update
      stateRef.current.retryCount += 1;
      
      // Only log specific retry attempts to reduce noise
      if (stateRef.current.retryCount % 10 === 0 || stateRef.current.retryCount === 1) {
        console.log(`[AudioPlayer] Reconnection attempt: ${stateRef.current.retryCount}`);
      }
      
      // Check if max retries reached for the first time
      if (!stateRef.current.maxRetriesReached && stateRef.current.retryCount >= stateRef.current.maxRetries) {
        console.log('[AudioPlayer] Max retries reached, station appears offline');
        stateRef.current.maxRetriesReached = true;
        
        // Update UI state (triggers render) but continue polling
        setStreamStatus('offline');
        setOfflineMessage('The station is currently offline. We will resume playback automatically when broadcasting resumes.');
      }

      // Reset checking state
      clearTimeout(safetyTimeoutRef.current);
      safetyTimeoutRef.current = null;
      stateRef.current.streamCheckInProgress = false;
      
      // Clean up test audio
      testAudio.oncanplaythrough = null;
      testAudio.onerror = null;
      testAudio.src = '';
      testAudioRef.current = null;
    };

    // Set source and load to trigger events
    testAudio.src = STREAM_URL;
    testAudio.load();
  }, [setCanPlay, audioPlayerRef]);

  // Stream recovery function
  const startStreamRecovery = useCallback(() => {
    // Prevent multiple recovery processes
    if (pollingIntervalRef.current) {
      return;
    }

    console.log('[AudioPlayer] Stream connection lost, attempting to reconnect');
    
    // Clean up any existing resources
    cleanupAll();
    
    // Reset state
    stateRef.current.retryCount = 0;
    stateRef.current.maxRetriesReached = false;
    
    // Update UI state (triggers render)
    setStreamStatus('reconnecting');
    setDisplayRetryCount(0);
    setOfflineMessage('Attempting to reconnect to the stream...');

    // Start polling interval
    pollingIntervalRef.current = setInterval(() => {
      checkStreamStatus();
    }, 5000);

    // Perform initial check
    checkStreamStatus();
  }, [checkStreamStatus, cleanupAll]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      cleanupAll();
    };
  }, [cleanupAll]);

  return {
    streamStatus,
    displayRetryCount,
    offlineMessage,
    startStreamRecovery
  };
}