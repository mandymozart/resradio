import { useLazyQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { gql } from "graphql-tag";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import useDebounce from "../../Hooks/useDebounce.";
import { BroadcastFragment, BroadcastTagsFragment, GetBroadcastQuery } from "../../Queries/broadcasts";
import useAudioPlayerStore from "../../Stores/AudioPlayerStore";
import useBroadcastStore from "../../Stores/BroadcastStore";
import ClearSmall from "../../images/ClearSmall";
import PauseBig from "../../images/PauseBig";
import PlayBig from "../../images/PlayBig";
import InlineLoader from "../InlineLoader";

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
    cursor: pointer;
    margin: 0;
    svg {
        height: 3rem;
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

export const getBroadcastQuery = gql`
${GetBroadcastQuery}
${BroadcastFragment}
${BroadcastTagsFragment}
`
const BroadcastPlayer = () => {
    const { setIsPlaying: setStreamIsPlaying, volume } = useAudioPlayerStore()
    const { playing, setPlaying, isPlaying, setIsPlaying } = useBroadcastStore()
    const [isVisible, setIsVisible] = useState(false);
    const [currentTime, setCurrentTime] = useState();
    const [source, setSource] = useState();
    const [duration, setDuration] = useState();
    const [broadcasts, setBroadcasts] = useState();
    const [broadcast, setBroadcast] = useState();
    const [trackProgress, setTrackProgress] = useState(0);
    const intervalRef = useRef();
    const audioRef = useRef();

    const [getData, { loading, error, data }] = useLazyQuery(
        getBroadcastQuery, {
        variables: {
            uid: playing
        },
        onCompleted: (data) => {
            console.log(data)
            setBroadcast(data.broadcasts)
            updateBroadcast(data.broadcasts)
            setIsVisible(true);
        }
    });

    // TODO: figure out how to not restart if playing is set to 
    // pause sets isPlaying to true, hence it retriggers loading
    const debouncedRequest = useDebounce(() => {
        console.log("got request")
        if (playing !== null)
            getData()
    });

    // useEffect(() => {
    //     const unsub = useBroadcastStore.subscribe(debouncedRequest)
    // }, [])
    useEffect(() => {
        debouncedRequest()
    }, [isPlaying])

    const startTimer = () => {
        // Clear any timers already running
        clearInterval(intervalRef.current);

        intervalRef.current = setInterval(() => {
            if (audioRef.current.ended) {
            } else {
                setTrackProgress(audioRef.current.currentTime);
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

    /**
   * 
   */
    const updateBroadcast = (broadcast) => {
        console.log("setting current", broadcast)
        if (broadcast) {
            setSource(broadcast.audio.url);
            getLengthOfMp3(broadcast.audio.url);
            //   setNext(getNextBroadcast(getIndex(broadcast)))
            setTimeout(() => {
                if (audioRef.current) {
                    audioRef.current.pause();
                    audioRef.current.load();
                    audioRef.current.play();
                    startTimer();
                    setTrackProgress(audioRef.current.currentTime);
                }
            }, 200)
        }
    }

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

    if (loading) return <Container><InlineLoader /></Container>
    if (error) return <Container><InlineLoader /></Container>
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
                        <div>{currentTime}</div>
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
