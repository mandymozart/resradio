import { useLazyQuery } from "@apollo/client";
import styled from "@emotion/styled";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
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
    &:hover{
        color: var(--second);
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
    .show-title, .broadcast-title {
        color: var(--background);
        font-family: var(--font-bold);
        margin: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        text-transform: none;
        font-size: 1rem;
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
`

const Controls = styled.div`
position: fixed;
right: 0;
bottom: 0;
width: 50%;
@media (max-width: ${BREAKPOINT_MD}px) {
    width: 100%;
}
height: 9rem;
transform: translateY(9rem);
background: var(--color);
color: var(--background);
.close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    height: 3rem;
    width: 3rem;
    cursor: pointer;
}
&.isVisible {
    transform: translateY(0);
}
`
const BroadcastPlayer = () => {
    const { setIsPlaying: setStreamIsPlaying, volume } = useAudioPlayerStore()
    const { playing, isPlaying, setIsPlaying, isVisible, setIsVisible } = useBroadcastStore()
    const [currentTime, setCurrentTime] = useState(0);
    const [source, setSource] = useState(null);
    const [duration, setDuration] = useState(0);
    const [broadcast, setBroadcast] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const audioRef = useRef();
    const progressBarRef = useRef();

    const playAudio = useCallback(async () => {
        if (!audioRef.current || !source) {
            console.log("Cannot play: audio element or source not available");
            return;
        }
        
        try {
            setIsLoading(true);
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

    const [getData] = useLazyQuery(
        getBroadcastQuery, {
        variables: {
            uid: playing
        },
        onError: (res) => {
            console.error("api error", res)
        },
        onCompleted: async (data) => {
            setBroadcast(data.broadcasts);
            setSource(data.broadcasts.audio);
            const duration = data.broadcasts.duration ? data.broadcasts.duration : data.broadcasts.length ? data.broadcasts.length * 60 : 3600;
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
                referenceText: data.broadcasts.title + " - " + data.broadcasts.hostedby.title,
                hostedbyUid: data.broadcasts.hostedby._meta.uid,
                date: dayjs().toISOString(),
                timezone: Intl.DateTimeFormat().resolvedOptions().locale + " " + Intl.DateTimeFormat().resolvedOptions().timeZone,
            }
            const queryString = getQueryString(playback);
            await fetch(`${FUNCTIONS}/log-playback?${queryString}`);
        }
    });

    const debouncedRequest = useDebounce(() => {
        if (playing === null) {
            return
        }
        
        if (playing !== broadcast?._meta?.uid) {
            getData();
        }
    });

    useEffect(() => {
        if (audioRef.current)
            audioRef.current.volume = volume;
    }, [volume]);

    useEffect(() => {
        if (playing === null) return;
        
        // Reset state for new selection
        setCurrentTime(0);
        
        // Clear previous broadcast data to avoid trying to play wrong audio
        if (playing !== broadcast?._meta?.uid) {
            // Only clear source if we're changing broadcasts
            setSource(null);
            setBroadcast(null);
        }
        
        // Start loading new broadcast data
        debouncedRequest();
    }, [playing, broadcast, debouncedRequest]);

    useEffect(() => {
        if (!source) return; // Skip if no source
        
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.load();
            
            // If isPlaying is true and we have a valid source, attempt to play
            if (isPlaying) {
                playAudio();
            }
        }
    }, [source, playAudio, isPlaying]);

    useEffect(() => {
        // Only attempt to play if we have a valid source
        if (isPlaying && audioRef.current && source) {
            playAudio();
        } else if (!isPlaying && audioRef.current) {
            pauseAudio();
        }
    }, [isPlaying, pauseAudio, playAudio, source]);

    const handleEnded = () => {
        setIsPlaying(false);
    }

    const onPlaying = (e) => {
        setCurrentTime(parseInt(e.target.currentTime));
    };

    const play = () => {
        playAudio();
    }
    
    const pause = () => {
        pauseAudio();
    }

    const handleTimeUpdate = useCallback(event => {
        const audioElement = event.target;
        setCurrentTime(parseInt(audioElement.currentTime));
    }, []);

    const close = () => {
        pauseAudio();
        setIsVisible(false);
    }

    return (
        <Container>
            {source && (
                <audio
                    ref={audioRef}
                    volume={volume}
                    onTimeUpdate={handleTimeUpdate}
                    onEnded={handleEnded}
                >
                    <source src={source} type='audio/mpeg'></source>
                </audio>
            )}
            {broadcast && (
                <Controls className={isVisible ? "isVisible" : ""}>
                    <Player>
                        {isPlaying ? (<button onClick={() => pause()}>
                            <PauseBig />
                        </button>) : (
                            <button onClick={() => play()}>
                                <PlayBig />
                            </button>
                        )}
                        <div className="info">
                            <Link to={"../broadcasts/" + broadcast._meta.uid}>
                                <h3 className="show-title">{broadcast.hostedby.title}</h3>
                                <span className="broadcast-title">{broadcast.title}</span>
                            </Link>
                        </div>
                        <ProgressBar className="progress-bar" progressBarRef={progressBarRef} audioRef={audioRef} timeProgress={currentTime} duration={duration} />
                    </Player>
                    <div className="close" onClick={() => close()}>
                        <ClearBig />
                    </div>
                </Controls>
            )}
        </Container>
    );
}

export default BroadcastPlayer;
