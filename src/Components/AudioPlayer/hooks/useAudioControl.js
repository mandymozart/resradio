import { useCallback, useEffect } from 'react';
import useAudioPlayerStore from '../../../Stores/AudioPlayerStore';
import useBroadcastStore from '../../../Stores/BroadcastStore';

/**
 * Custom hook for audio playback controls
 */
export default function useAudioControl(audioPlayerRef) {
  const { isPlaying, setIsPlaying, setIsLoading, volume } = useAudioPlayerStore();
  const { setCanPlay, setBroadcastIsPlaying } = useBroadcastStore();

  // Player control functions
  const play = useCallback(() => {
    setIsPlaying(true);
    setBroadcastIsPlaying(false);

    try {
      audioPlayerRef.current.play().catch(() => {});
    } catch (error) {}
  }, [setIsPlaying, setBroadcastIsPlaying, audioPlayerRef]);

  const pause = useCallback(() => {
    setIsPlaying(false);

    try {
      audioPlayerRef.current.pause();
    } catch (error) {}
  }, [setIsPlaying, audioPlayerRef]);

  // Handle audio player events
  const handleEnded = useCallback(() => {
    setCanPlay(false);
  }, [setCanPlay]);

  const handleError = useCallback((e) => {
    setIsLoading(false);
    setCanPlay(false);
    
    // We'll return this so it can be used to trigger stream recovery
    return true;
  }, [setIsLoading, setCanPlay]);

  const onCanPlayThrough = useCallback(() => {
    setCanPlay(true);
    setIsLoading(false);
    if (audioPlayerRef.current) {
      audioPlayerRef.current.volume = volume;
    }
  }, [setCanPlay, setIsLoading, volume, audioPlayerRef]);

  // Sync volume when it changes
  useEffect(() => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.volume = volume;
    }
  }, [volume, audioPlayerRef]);

  // Pause when isPlaying changes to false
  useEffect(() => {
    if (!isPlaying && audioPlayerRef.current) {
      pause();
    }
  }, [isPlaying, pause, audioPlayerRef]);

  return {
    isPlaying,
    volume,
    play,
    pause,
    handleEnded,
    handleError,
    onCanPlayThrough
  };
}