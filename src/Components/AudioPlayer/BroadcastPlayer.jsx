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
import { BREAKPOINT_MD, FUNCTIONS, OFFLINE_URL } from "../../config";
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
    const [currentTime, setCurrentTime] = useState(1);
    const [source, setSource] = useState(OFFLINE_URL);
    const [duration, setDuration] = useState();
    const [broadcast, setBroadcast] = useState();
    const audioRef = useRef();
    const progressBarRef = useRef();

    const [getData] = useLazyQuery(
        getBroadcastQuery, {
        variables: {
            uid: playing
        },
        onError: (res) => {
            console.error("api error", res)
        },
        onCompleted: async (data) => {
            setBroadcast(data.broadcasts)
            setSource(data.broadcasts.audio);
            // getLengthOfMp3(broadcast.audio);
            const duration = data.broadcasts.duration ? data.broadcasts.duration : data.broadcasts.length ? data.broadcasts.length * 60 : 3600
            setDuration(duration);
            setCurrentTime(0);
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
            getData()
        }
        // play if uid is available
        else {
            audioRef.current.play();
            setIsPlaying(true);
        }
    });

    useEffect(() => {
        if (audioRef.current)
            audioRef.current.volume = volume;
    }, [volume])

    useEffect(() => {
        setCurrentTime(0);
        setIsPlaying(false);
        debouncedRequest();
    }, [playing])

    /** Resetting source audio magic and tracking progress */
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.load();
        }
        setCurrentTime(0);
    }, [source])

    const handleEnded = () => {
        setIsPlaying(false);
    }

    const onPlaying = (e) => {
        setCurrentTime(parseInt(e.target.currentTime));
    };

    const play = () => {
        setIsPlaying(true)
        setIsVisible(true)
        setStreamIsPlaying(false)
        audioRef.current.play();
    }
    const pause = () => {
        audioRef.current.pause();
        setIsPlaying(false)
    }
    useEffect(() => {
        isPlaying ? play() : pause();
    }, [isPlaying])

    const close = () => {
        pause();
        setIsVisible(false);
    }

    const handleTimeUpdate = useCallback(event => {
        const audioElement = event.target;
        // Perform actions based on the updated time
        setCurrentTime(parseInt(audioElement.currentTime));
    }, []);

    return (
        <Container>
            <audio
                ref={audioRef}
                volume={volume}
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleEnded}
            >
                <source src={source} type='audio/mpeg'></source>
            </audio>
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
