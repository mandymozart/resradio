import { useChannel } from "@ably-labs/react-hooks";
import { useQuery } from '@apollo/client';
import styled from '@emotion/styled';
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import React, { useEffect, useRef, useState } from "react";
import { useNetlifyIdentity } from "react-netlify-identity";
import { useParams } from 'react-router-dom';
import { getPlaylistQuery } from "../../../Queries/playlists";
import { getQueryString } from "../../../utils";
import Button from "../../Button";
import KeyFieldParagraph from "../../KeyFieldParagraph";
import SectionLoader from "../../SectionLoader";
import HeroImage from "../../TeaserImage/HeroImage";
import Listeners from "../Listeners/Listeners";
import { RemoteMethods } from "../Remote/Remote";
import config, { BREAKPOINT_MD, BREAKPOINT_XS, FUNCTIONS } from "./../../../config";
import PauseBig from "./../../../images/PauseBig";
import PlayBig from "./../../../images/PlayBig";
dayjs.extend(localizedFormat);

const Container = styled.div`
h4 { 
    padding: 1rem 2rem; 
    margin: 0;
    
    @media (max-width: ${BREAKPOINT_XS}px) {
        font-size: 1rem;
        padding: 1rem 1rem 0 1rem;
    }
}
.meta {
    padding: 0 2rem;
    font-size: 1rem;
    @media (max-width: ${BREAKPOINT_XS}px) {
        padding: 0 1rem
    }
}
.remote {
    padding: 2rem;
    @media (max-width: ${BREAKPOINT_XS}px) {
        padding: 1rem
    }
    span {
        color: white;
        margin-right: 1rem;
        font-size: 1rem;
        background-color: red;
        padding: .3rem 1rem;
        border-radius: .1rem;
        font-family: var(--font-medium);
        text-transform: uppercase;
    }
}
.controls {
  padding: 1rem 2rem;
  @media (max-width: ${BREAKPOINT_XS}px) {
    padding: 1rem;
  }
  > div {
    display: flex;
    gap: 1rem;
    align-items: center;
    justify-content: space-between;
  }
  .title {
    @media (max-width: ${BREAKPOINT_XS}px) {
        font-size: 1.25rem;
    }
  }
  .controls-buttons {
    display: flex;
    justify-items: center;
    gap: .5rem;
    border-radius: .5rem;
  }
  input {
    width: 100%;
  }
  button {
    cursor: pointer;
    height: 4rem;
    width: 4rem;
    font-size: 2rem;
    background-color: var(--grey);
    font-size: 3rem;
    line-height: 2rem;
    svg {
            height: 3rem;
        }
    @media (max-width: ${BREAKPOINT_XS}px) {
        height: 2rem;
        width: 2rem;
        font-size: 1rem;
        line-height: 2rem;
        svg {
            height: 1rem;
        }
    }
  }
}
.list {
  padding: 2rem;
  border-bottom: 2px solid var(--color); 
  h6 {
    margin-top: 0;
    margin-bottom: 1rem;
  }
  @media (max-width: ${BREAKPOINT_XS}px) {
        padding: 1rem;
        font-size: 1rem;
    }
  .broadcast {
    display: grid;
    grid-template-columns: 1fr 31fr;
    gap: 1rem;
    cursor: pointer;
    > div:first-of-type {
        font-size: 1rem;
        background-color: var(--grey);
        padding: 0.5rem;
        border-radius: .5rem;
    }
    &:hover {
      color: var(--second);
    }
  }
}
.status {
  font-size: 1rem;
  padding: 2rem;
  border-bottom: 2px solid var(--color); 
}
`

const Description = styled.section`
  font-size: 1.5rem;
  margin-top: 3rem;
  padding: 2rem;
  display: grid;
  grid-template-columns: 2fr 2fr;
  @media (max-width: ${BREAKPOINT_MD}px) {
    display: flex;
    flex-direction: column-reverse;
  }
  @media (max-width: ${BREAKPOINT_XS}px) {
    font-size: 1rem;
    padding: 1rem;
    margin-top: 1rem;
  }
  gap: 2rem;
`;

const Player = () => {

    const { uid } = useParams();

    const { loading, error, data } = useQuery(getPlaylistQuery, { variables: { uid: uid } });
    const audioRef = useRef();
    const [current, setCurrent] = useState();
    const [next, setNext] = useState();
    const [source, setSource] = useState();
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState();
    const [currentTime, setCurrentTime] = useState();
    const [isBlocked, setIsBlocked] = useState(true);

    const [broadcasts, setBroadcasts] = useState();
    const [trackProgress, setTrackProgress] = useState(0);
    const [remote, setRemote] = useState(undefined);
    // const [token, setToken] = useState();
    const intervalRef = useRef();

    // rotation socket
    const [rotationInfo, setRotationInfo] = useState();
    const [rotationChannel] = useChannel(config.ABLY_ROTATION_CHANNEL, (message) => {
        setRotationInfo(message)
    });

    // remote socket
    const { user } = useNetlifyIdentity();

    const [remoteChannel] = useChannel(config.ABLY_REMOTE_CHANNEL, (message) => {
        // if (isBlocked) {

        //     handleBlocked();
        //     return
        // }
        if (message.data.method === RemoteMethods.outgoing.CONNECT) {
            handleConnect(message);
            return
        }
        // if (!remote?.data?.token === message.data.token) {
        //     handleUnauthorized()
        //     return
        // }
        if (message.data.method === RemoteMethods.outgoing.CLOSE) {
            handleClose()
            return
        }
        if (message.data.method === RemoteMethods.outgoing.PLAY) {
            handlePlay()
            return
        }
        if (message.data.method === RemoteMethods.outgoing.PAUSE) {
            handlePause()
            return
        }
        if (message.data.method === RemoteMethods.outgoing.NEXT) {
            handleNext()
            return
        }
        if (message.data.method === RemoteMethods.outgoing.PREVIOUS) {
            handlePrevious()
            return
        }
        if (!remote) {
            return
        }
        return
    });


    const currentPercentage = audioRef.current
        ? `${(trackProgress / audioRef.current) * 100}%`
        : "0%";
    const trackStyling = `
    -webkit-gradient(linear, 0% 0%, 100% 0%, color-stop(${currentPercentage}, #fff), color-stop(${currentPercentage}, #777))
  `;



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

    const onScrub = (value) => {
        // Clear any timers already running
        clearInterval(intervalRef.current);
        audioRef.current.currentTime = value;
        setTrackProgress(audioRef.current.currentTime);
    };

    const onScrubEnd = () => {
        // If not already playing, start
        if (!isPlaying) {
            setIsPlaying(true);
        }
        startTimer();
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

    const getPreviousIndex = (broadcast) => {
        const index = broadcasts.findIndex(node => node.broadcast._meta.id === broadcast._meta.id)
        if (index - 1 > -1) {
            return index - 1
        }
        else {
            return broadcasts.length - 1
        }
    }
    const getNextIndex = (broadcast) => {
        const index = broadcasts.findIndex(node => node.broadcast._meta.id === broadcast._meta.id)
        if (index + 1 < broadcasts.length) {
            return index + 1
        }
        else {
            return 0
        }
    }

    // send notification to RadioApp/ShortInfo
    const sendRotationMessage = async (broadcast, nextBroadcast) => {
        const cue = {
            current:
            {
                begin: dayjs().toISOString(),
                end: dayjs().add(parseInt(duration), 'seconds').toISOString(),
                title: broadcast.title,
                hostedby: broadcast.hostedby.title,
                // TODO: remove anything but UID (depends on shortinfo)
                uid: broadcast._meta.uid
            }, next:
            {
                title: nextBroadcast.title,
                hostedby: nextBroadcast.hostedby.title,
                // TODO: remove anything but UID (depends on short info update)
                uid: nextBroadcast._meta.uid,
            }
        }
        rotationChannel.publish(config.ABLY_ROTATION_CHANNEL, cue);

        const queryString = getQueryString(cue.current);
        await fetch(`${FUNCTIONS}/create-playlist-entry?${queryString}`).then((r) => {
            if (!r.ok) {
                console.warn("error writing to cue");
            }
        });
    }

    /**
     * 
     * @param {number} index *optional
     */
    const updateBroadcast = (index) => {
        const i = getNextIndex(current);
        const broadcast = index !== undefined ? broadcasts[index].broadcast : broadcasts[i].broadcast
        const nI = getNextIndex(broadcast);
        const nextBroadcast = broadcasts[nI].broadcast;
        if (broadcast) {
            setSource(broadcast.audio);
            getLengthOfMp3(broadcast.audio);
            setCurrent(broadcast);
            isPlaying ? setIsPlaying(true) : setIsPlaying(false);
            setNext(nextBroadcast)
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.load();
                if (isPlaying)
                    audioRef.current.play();
                startTimer();
                setTrackProgress(audioRef.current.currentTime);
            }
            sendRotationMessage(broadcast, nextBroadcast)
        }
    }

    // only once
    const loadBroadcast = (broadcast) => {
        if (broadcast) {
            getLengthOfMp3(broadcast.audio);
            setSource(broadcast.audio);
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.load();
            }
            setCurrent(broadcast)
            setNext(broadcasts[getNextIndex(broadcast)].broadcast);
        }
    }

    useEffect(() => {
        // init Player
        if (data) {
            setBroadcasts(data.allPlaylists.edges[0].node.broadcasts.filter(i => i.broadcast.audio))
        }
    }, [data])

    useEffect(() => {
        if (broadcasts)
            loadBroadcast(data.allPlaylists.edges[0].node.broadcasts[0].broadcast)
    }, [broadcasts, data.allPlaylists.edges])


    const onPlaying = (e) => {
        setCurrentTime(parseInt(e.target.currentTime));
    };

    // TODO: Increase blocking authorization 
    // const handleUnauthorized = () => {
    //     const data = {
    //         status: "unauthorized",
    //         method: RemoteMethods.incoming.AUTHORIZE
    //     }
    //     remoteChannel.publish(config.ABLY_REMOTE_CHANNEL, data)
    // }

    const handleConnect = (message) => {
        setRemote(message.connectionId)
        const data = {
            token: "approved",
            status: "ok",
            method: RemoteMethods.incoming.AUTHORIZE,
            user: user
        }
        remoteChannel.publish(config.ABLY_REMOTE_CHANNEL, data)
    }

    const handleBlocked = () => {
        setIsBlocked(true);
        // const data = {
        //     status: "blocked",
        //     method: RemoteMethods.incoming.BLOCKED,
        //     user: user
        // }
        // remoteChannel.publish(config.ABLY_REMOTE_CHANNEL, data)
    }

    const handleEnded = () => {

        updateBroadcast()
    }

    const handlePlay = () => {
        audioRef.current.play();
        setIsPlaying(true);
        startTimer();
    }

    const handlePause = () => {
        audioRef.current.pause();
        setIsPlaying(false);
    }
    const handleNext = () => {
        updateBroadcast()
    }
    const handlePrevious = () => {
        updateBroadcast(getPreviousIndex(current))
    }
    const handleClose = () => {
        setRemote(undefined)
        const data = {
            method: RemoteMethods.incoming.CONNECTION_CLOSED,
        }
        remoteChannel.publish(config.ABLY_REMOTE_CHANNEL, data)
    }

    const onCanPlay = () => {
        // TODO: maybe don't need
    };

    useEffect(() => {
        // Pause and clean up on unmount
        return () => {
            // audioRef.current.pause();
            clearInterval(intervalRef.current);
        };
    }, []);

    if (loading || !broadcasts || !current || !next) return <SectionLoader />;
    if (error) return <>Error : {error.message}</>;
    const playlist = data.allPlaylists.edges[0].node;
    return (
        <Container>
            <HeroImage image={playlist.image.hero ? playlist.image.hero : playlist.image} />
            <h4>{playlist.title}</h4>
            <div className="meta">
                {broadcasts.length} Broadcasts
            </div>
            <Description>
                {playlist.description ? (
                    <KeyFieldParagraph text={playlist.description} />
                ) : (
                    <div></div>
                )}
            </Description>
            <div className="remote">
                {!isPlaying && <span>Paused</span>}
                {remote && (<>
                    <span style={{ color: "var(--second)" }}>Remote</span>
                </>)}
                {isBlocked ? <Button onClick={() => { setIsBlocked(false); }}>Unblock Remote</Button> : <Button onClick={() => { handleClose(); handleBlocked(); }}>Block</Button>}
            </div>
            <div className='controls'>
                <div>
                    <div className="controls-buttons">
                        <button onClick={() => handlePrevious()}>&lt;</button>
                        {isPlaying ?
                            <button onClick={() => handlePause()}><PauseBig /></button> :
                            <button onClick={() => handlePlay()}><PlayBig /></button>}
                        <button onClick={() => handleNext()}>&gt;</button>
                    </div>
                    <audio ref={audioRef}
                        onTimeUpdate={onPlaying}
                        onCanPlay={onCanPlay}
                        onEnded={handleEnded}>
                        <source src={source} type='audio/mpeg'></source>
                    </audio>
                    <div className="title">{current?.hostedby?.title} &mdash; {current?.title}</div>
                    <div className="duration">
                        {currentTime}/{duration}
                    </div>
                </div>
                <input
                    type="range"
                    value={trackProgress}
                    step="1"
                    min="0"
                    max={duration ? duration : `${duration}`}
                    className="progress"
                    onChange={(e) => onScrub(e.target.value)}
                    onMouseUp={onScrubEnd}
                    onKeyUp={onScrubEnd}
                    style={{ background: trackStyling }}
                />
            </div>
            <div className='list'>
                <h6>Cue</h6>
                {broadcasts.map((node, index) => {
                    return (
                        <div key={index}
                            onClick={() => updateBroadcast(index)}
                            className={node.broadcast._meta.id
                                ===
                                current._meta.id ? "broadcast current" : "broadcast"}>
                            <div>{index}</div> <div>{node?.broadcast?.hostedby?.title} &mdash; {node.broadcast.title}</div>
                        </div>
                    )
                }
                )}
            </div>
            <div className="status">
                <h6>Status</h6>
                {rotationInfo ? (
                    <>
                        {dayjs(rotationInfo.data.begin).format("ddd, HH:mm")} - {dayjs(rotationInfo.data.end).format("HH:mm")} {rotationInfo.data.hostedby} &mdash; {rotationInfo.data.title}
                    </>
                ) : (<>Currently not playing</>)}
                <Listeners />
            </div>
        </Container>
    )
}

export default Player;