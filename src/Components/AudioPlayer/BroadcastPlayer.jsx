import { useLazyQuery } from "@apollo/client";
import styled from "@emotion/styled";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import useIsMounted from "../../Hooks/isMounted";
import useDebounce from "../../Hooks/useDebounce.";
import { getBroadcastQuery } from "../../Queries/broadcasts";
import useAudioPlayerStore from "../../Stores/AudioPlayerStore";
import useBroadcastStore from "../../Stores/BroadcastStore";
import { BREAKPOINT_MD, BREAKPOINT_XS } from "../../config";
import ClearSmall from "../../images/ClearSmall";
import PauseBig from "../../images/PauseBig";
import PlayBig from "../../images/PlayBig";
import { secondsToMinutes } from "../../utils";

const Container = styled.div`
position: fixed;
right: 0;
bottom: 0;
`;

const Player = styled.div`
  display: flex;
    align-items: center;
    height: 6rem;
    padding: 0 2rem 2rem 0 0;
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
    width: 6rem;
    @media (max-width: ${BREAKPOINT_XS}px) {
            width: 4rem;
        }
    cursor: pointer;
    margin: 0;
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
  .left {
    display: flex;
    align-items: center; 
  }
  .info {
    flex: 1;
    font-size: 1rem;
  }
  .time {
    font-size: 1rem;
    width: 4rem;
    }
  .image {
    text-align: right;
    img {
        width: 4rem;
        height: 4rem;
        margin-right: 2rem;
    }
  }

`

const Controls = styled.div`
position: fixed;
right: 0;
bottom: 0;
width: 50vw;
@media (max-width: ${BREAKPOINT_MD}px) {
    width: 100vw;
}
height: 6rem;
transform: translateY(10rem);
background: var(--grey);
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
    const isMounted = useIsMounted();
    const { playing, isPlaying, setIsPlaying, isLoading, setIsLoading, error, setError } = useBroadcastStore()
    const [isVisible, setIsVisible] = useState(false);
    const [currentTime, setCurrentTime] = useState();
    const [source, setSource] = useState();
    const [duration, setDuration] = useState();
    const [broadcast, setBroadcast] = useState();
    const [negativeTime, setNegativeTime] = useState(true);
    const [trackProgress, setTrackProgress] = useState(0);
    const intervalRef = useRef();
    const audioRef = useRef();

    const [getData] = useLazyQuery(
        getBroadcastQuery, {
        variables: {
            uid: playing
        },
        onError: (res) => {
            console.error("api error", res)
            setBroadcast(res)
        },
        onCompleted: (data) => {
            console.log(data)
            setIsLoading(false);
            setBroadcast(data.broadcasts)
            // onUpdateBroadcast(data.broadcasts)

        }
    });

    const debouncedRequest = useDebounce(() => {
        if (isPlaying) {
            if (playing === null) {
                console.error("no broadcast uid found to play")
                return
            }
            console.log("got request to play", playing, broadcast)
            if (playing !== broadcast?._meta?.uid) {
                getData()
            } else {
                console.log("broadcast did not change. resume playing")
                audioRef.current.play();
                setIsVisible(true);
            }
        } else {
            if (audioRef.current)
                pause();
        }
    });

    useEffect(() => {
        if (audioRef.current)
            audioRef.current.volume = volume;
    }, [volume])

    useEffect(() => {
        console.log("isPlaying change is fired", isPlaying)
        setIsLoading(true);
        debouncedRequest()
    }, [isPlaying])

    const startTimer = () => {
        // Clear any timers already running
        clearInterval(intervalRef.current);

        intervalRef.current = setInterval(() => {
            if (audioRef.current) {
                if (audioRef.current.ended) {
                } else {
                    setTrackProgress(audioRef.current.currentTime);
                }
            }
        }, [1000]);
    };

    const getLengthOfMp3 = async (mp3file) => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)()
        const request = new XMLHttpRequest()
        request.open('GET', mp3file, true)
        request.responseType = 'arraybuffer'
        request.onload = function () {
            audioContext.decodeAudioData(request.response,
                function (buffer) {
                    const duration = buffer.duration
                    setDuration(duration)
                }
            )
        }
        request.send()
    }

    const resetAudioRef = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.load();
            audioRef.current.play();
            startTimer();
            setTrackProgress(audioRef.current.currentTime);
        }
    }
    /** Resetting source audio magic and tracking progress */
    useEffect(() => {
        resetAudioRef()
    }, [source])

    /** On Update Broadcast */
    useEffect(() => {
        console.log("setting current", broadcast)
        if (broadcast) {
            setSource(broadcast.audio.url);
            getLengthOfMp3(broadcast.audio.url);
            setIsVisible(true);
        } else {
            console.warn("No broadcast loaded.")
        }
    }, [broadcast])

    const handleEnded = () => {
        setIsPlaying(false);
    }

    const handleVolumeChange = (e) => {
        // setVolume(e.value)
        audioRef.current.volume = e.value;
    }

    const onPlaying = (e) => {
        // TODO: check with length and prepare file change when nessecary
        setCurrentTime(parseInt(e.target.currentTime));
    };

    const play = () => {
        setIsPlaying(true)
        setStreamIsPlaying(false)
        audioRef.current.play();
    }
    const pause = () => {
        audioRef.current.pause();
        setIsPlaying(false)
    }

    const close = () => {
        pause();
        setIsVisible(false);
    }
    if (broadcast)
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
                <Controls className={isVisible ? "isVisible" : ""}>
                    <Player>
                        {isPlaying ? (<button onClick={() => pause()}>
                            <PauseBig />
                        </button>) : (
                            <button onClick={() => play()}>
                                <PlayBig />
                            </button>
                        )}
                        <div className="time" onClick={() => setNegativeTime(!negativeTime)}>{negativeTime ? <>{secondsToMinutes(
                            currentTime)}</> : <>-{secondsToMinutes(
                                duration - currentTime)}</>}</div>
                        <div className="info">
                            <Link to={"../broadcasts/" + broadcast._meta.uid}>
                                <h3>{broadcast.hostedby.title}</h3>
                                <div>{broadcast.title}</div>
                            </Link>
                        </div>
                        {/* <div className="image">
                                <ThumbnailImage image={broadcast.image.thumbnail} />
                            </div> */}
                    </Player>
                    <div className="close" onClick={() => close()}>
                        <ClearSmall />
                    </div>
                </Controls>
            </Container>
        );
};

export default BroadcastPlayer;
