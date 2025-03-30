import { useLazyQuery } from "@apollo/client";
import styled from "@emotion/styled";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import useDebounce from "../../Hooks/useDebounce.";
import { getBroadcastQuery } from "../../Queries/broadcasts";
import useAudioPlayerStore from "../../Stores/AudioPlayerStore";
import useBroadcastStore from "../../Stores/BroadcastStore";
import { BREAKPOINT_MD, FUNCTIONS } from "../../config";
import ClearBig from "../../images/ClearBig";
import PauseBig from "../../images/PauseBig";
import PlayBig from "../../images/PlayBig";
import { getQueryString } from "../../utils";
import ProgressBar from "./ProgressBar";
import LoadingSpinner from "../Loaders/LoadingSpinner";
dayjs.extend(utc);

const Container = styled.div`
  position: fixed;
  right: 0;
  bottom: 0;
  z-index: 1;
`;

const Player = styled.div`
  padding: 1rem;
  display: grid;
  grid-template-columns: 3rem auto 3rem;
  gap: 1rem;
  button {
    background: none;
    border: none;
    padding: 0;
    text-align: center;
    display: block;
    cursor: pointer;
    margin: 0;
    color: var(--background);
    &:hover {
      color: var(--second);
    }

    /* Adding transition for button content */
    svg,
    div {
      transition: opacity 0.3s ease;
    }
  }
  .info {
    display: flex;
    align-items: center;
    overflow: hidden;
    text-overflow: ellipsis;
    a {
      display: block;
      line-height: 1.1rem;
    }
    .show-title,
    .broadcast-title {
      color: var(--background);
      font-family: var(--font-bold);
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      text-transform: none;
      font-size: 1rem;
      transition: opacity 0.3s ease;
    }
    .broadcast-title {
      font-family: var(--font-light);
    }
    color: var(--background);
  }
  .progress {
    grid-column: span 3;
    padding: 0 0.5rem;
    height: 3rem;
  }
`;

const Controls = styled.div`
  position: fixed;
  right: 0;
  bottom: 0;
  width: 50%;
  @media (max-width: ${BREAKPOINT_MD}px) {
    width: 100%;
  }
  height: 9rem;
  background: var(--color);
  color: var(--background);

  .close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    height: 3rem;
    width: 3rem;
    cursor: pointer;
    opacity: 0.8;
    transition: opacity 0.3s ease, transform 0.3s ease;

    &:hover {
      opacity: 1;
      transform: scale(1.05);
    }
  }
`;

const BroadcastPlayer = () => {
  const { setIsPlaying: setStreamIsPlaying, volume } = useAudioPlayerStore();
  const { playing, isPlaying, setIsPlaying, isVisible, setIsVisible } =
    useBroadcastStore();
  const [currentTime, setCurrentTime] = useState(0);
  const [source, setSource] = useState(null);
  const [duration, setDuration] = useState(0);
  const [broadcast, setBroadcast] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  // No longer need isHiding state with Framer Motion
  const audioRef = useRef();
  const progressBarRef = useRef();

  const playAudio = useCallback(async () => {
    if (!audioRef.current || !source) {
      console.log("Cannot play: audio element or source not available");
      return;
    }

    try {
      setIsLoading(true);
      // Don't reset currentTime here - it should continue from where it was paused
      await audioRef.current.play();
      setIsPlaying(true);
      setStreamIsPlaying(false);
      setIsVisible(true);
    } catch (error) {
      console.error("Failed to play audio:", error);
      setIsPlaying(false);
    } finally {
      setIsLoading(false);
    }
  }, [setIsPlaying, setStreamIsPlaying, setIsVisible, source]);

  const pauseAudio = useCallback(() => {
    if (!audioRef.current) return;

    audioRef.current.pause();
    setIsPlaying(false);
  }, [setIsPlaying]);

  const [getData] = useLazyQuery(getBroadcastQuery, {
    variables: {
      uid: playing,
    },
    onError: (res) => {
      console.error("api error", res);
    },
    onCompleted: async (data) => {
      setBroadcast(data.broadcasts);
      setSource(data.broadcasts.audio);
      const duration = data.broadcasts.duration
        ? data.broadcasts.duration
        : data.broadcasts.length
        ? data.broadcasts.length * 60
        : 3600;
      setDuration(duration);
      setCurrentTime(0);

      // If isPlaying is true, attempt to play once the source is set
      if (isPlaying) {
        // Use setTimeout to ensure this runs after state updates have been applied
        setTimeout(() => {
          playAudio();
        }, 0);
      }

      // Log the playback
      const playback = {
        uid: playing,
        referenceText:
          data.broadcasts.title + " - " + data.broadcasts.hostedby.title,
        hostedbyUid: data.broadcasts.hostedby._meta.uid,
        date: dayjs().toISOString(),
        timezone:
          Intl.DateTimeFormat().resolvedOptions().locale +
          " " +
          Intl.DateTimeFormat().resolvedOptions().timeZone,
      };
      const queryString = getQueryString(playback);
      await fetch(`${FUNCTIONS}/log-playback?${queryString}`);
    },
  });

  const debouncedRequest = useDebounce(() => {
    if (playing === null) {
      return;
    }

    if (playing !== broadcast?._meta?.uid) {
      getData();
    }
  });

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    if (playing === null) return;

    // Only reset state and clear broadcast data when changing to a different broadcast
    if (playing !== broadcast?._meta?.uid) {
      // Reset state for new selection
      setCurrentTime(0);

      // Clear previous broadcast data to avoid trying to play wrong audio
      setSource(null);
      setBroadcast(null);

      // Start loading new broadcast data
      debouncedRequest();
    }
  }, [playing, broadcast, debouncedRequest]);

  useEffect(() => {
    if (!source) return; // Skip if no source

    if (audioRef.current) {
      // Don't reset the current time when the source is the same
      // Only load if we're changing sources
      const currentSrc = audioRef.current.src || "";
      const needsReload = !currentSrc.includes(source);

      if (needsReload) {
        const currentPosition = audioRef.current.currentTime || 0;
        audioRef.current.pause();
        audioRef.current.src = source;
        audioRef.current.load();
        // Only reset currentTime if we're loading a new source
        setCurrentTime(0);
      }

      // If isPlaying is true and we have a valid source, attempt to play
      if (isPlaying && needsReload) {
        playAudio();
      }
    }
  }, [source, playAudio, isPlaying]);

  useEffect(() => {
    // Only attempt to play if we have a valid source
    if (isPlaying && audioRef.current && source) {
      // Don't reset currentTime when resuming playback
      if (audioRef.current.paused) {
        playAudio();
      }
    } else if (!isPlaying && audioRef.current) {
      pauseAudio();
    }
  }, [isPlaying, pauseAudio, playAudio, source]);

  const handleEnded = () => {
    setIsPlaying(false);
  };

  const handleLoadingChange = (loading) => {
    setIsLoading(loading);
  };

  const play = () => {
    playAudio();
  };

  const pause = () => {
    pauseAudio();
  };

  const handleTimeUpdate = useCallback((event) => {
    const audioElement = event.target;
    setCurrentTime(parseInt(audioElement.currentTime));
  }, []);

  const close = () => {
    pauseAudio();
    setIsVisible(false);
  };

  return (
    <Container>
      {source && (
        <audio
          ref={audioRef}
          volume={volume}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
        >
          <source src={source} type="audio/mpeg"></source>
        </audio>
      )}
      {broadcast && (
        <>
          {isVisible && (
            <Controls            >
              <Player>
                <button onClick={isPlaying ? pause : play}>
                  {isLoading && <LoadingSpinner />}
                  {!isLoading && isPlaying && <PauseBig />}
                  {!isLoading && !isPlaying && <PlayBig />}
                </button>
                <div className="info">
                  <Link to={"../broadcasts/" + broadcast._meta.uid}>
                    <h3 className="show-title">{broadcast.hostedby.title}</h3>
                    <span className="broadcast-title">{broadcast.title}</span>
                  </Link>
                </div>
                <ProgressBar
                  className="progress-bar"
                  progressBarRef={progressBarRef}
                  audioRef={audioRef}
                  timeProgress={currentTime}
                  duration={duration}
                  onLoadingChange={handleLoadingChange}
                />
              </Player>
              <motion.div
                className="close"
                onClick={() => close()}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.02 }}
              >
                <ClearBig />
              </motion.div>
            </Controls>
          )}
        </>
      )}
    </Container>
  );
};

export default BroadcastPlayer;
