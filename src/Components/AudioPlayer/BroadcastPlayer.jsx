import { useLazyQuery } from "@apollo/client";
import styled from "@emotion/styled";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import useDebounce from "../../Hooks/useDebounce.";
import { getBroadcastQuery } from "../../Queries/broadcasts";
import useAudioPlayerStore from "../../Stores/AudioPlayerStore";
import useBroadcastStore from "../../Stores/BroadcastStore";
import { BREAKPOINT_MD, BREAKPOINT_XS, FUNCTIONS, OFFLINE_URL } from "../../config";
import ClearSmall from "../../images/ClearSmall";
import PauseBig from "../../images/PauseBig";
import PlayBig from "../../images/PlayBig";
import { getQueryString } from "../../utils";
import ProgressBar from "./ProgressBar";
dayjs.extend(utc);

const Container = styled.div`
position: fixed;
right: 0;
bottom: 0;
`;

const Player = styled.div`
    display: flex;
    align-items: center;
    height: 6rem;
    padding: 0 0 0 0;
    @media (max-width: ${BREAKPOINT_XS}px) {
        height: 5rem;
        padding-top: .5rem;
        display: grid;
        grid-template-columns: 4rem auto;
        grid-template-areas:
            "left top"
            "bottom bottom";
    }

  h3 {
    font-size: 1rem;
    font-family: var(--font-bold);
    margin-bottom: 0; 
    text-transform: none;
  }
  font-size: 1.5rem;
  button {
    background: none;
    border: none;
    padding: 0;
    text-align: center;
    display: block;
    flex: 4rem 0 0;
    cursor: pointer;
    margin: 0;
    color: var(--background);
    @media (max-width: ${BREAKPOINT_XS}px) {
        grid-area: left
    }
    svg {
        height: 3rem;
        @media (max-width: ${BREAKPOINT_XS}px) {
            height: 2rem;
        }
    }
    &:hover{
      color: var(--second);
    }
  }
  .info {
    flex: calc(50% - 2rem) 0 0;
    font-size: 1rem;
    div, h3  { 
        color: var(--background);
    }
    @media (max-width: ${BREAKPOINT_XS}px) {
        grid-area: top;
    }
  }


  /* .image {
    text-align: right;
    img {
        width: 4rem;
        height: 4rem;
        margin-right: 2rem;
    }
  } */

`

const Controls = styled.div`
position: fixed;
right: 0;
bottom: 0;
width: 50%;
@media (max-width: ${BREAKPOINT_MD}px) {
    width: 100%;
}
height: 6rem;
transform: translateY(10rem);
background: var(--color);
color: var(--background);
.close {
    position: absolute;
    top: 1rem;
    right: 1rem;
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
            setDuration(data.broadcasts.length ? data.broadcasts.length : 3600);
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
            console.warn("no broadcast uid found to play. waiting for user input")
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

    const resetAudioRef = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.load();
            console.log("resetting audio ref")
        }
        setCurrentTime(0);
    }

    /** Resetting source audio magic and tracking progress */
    useEffect(() => {
        resetAudioRef()
    }, [source])

    /** On Update Broadcast JUST FOR INFO and Debugging */
    useEffect(() => {
        if (broadcast) {
            console.log("broadcast updated", broadcast)
        } else {
            console.warn("no broadcast loaded")
        }
    }, [broadcast])

    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            console.log("initial audio is ready to play")
        }
        else {
            console.log("nope")
        }
    }, []);

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
    return (
        <Container>
            <audio
                ref={audioRef}
                volume={volume}
                onTimeUpdate={onPlaying}
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
                        <ProgressBar progressBarRef={progressBarRef} audioRef={audioRef} timeProgress={currentTime} duration={duration} />
                        <div className="info">
                            <Link to={"../broadcasts/" + broadcast._meta.uid}>
                                <h3>{broadcast.hostedby.title}</h3>
                                <div>{broadcast.title}</div>
                            </Link>
                        </div>
                    </Player>
                    <div className="close" onClick={() => close()}>
                        <ClearSmall />
                    </div>
                </Controls>
            )}
        </Container>
    );
}

export default BroadcastPlayer;
