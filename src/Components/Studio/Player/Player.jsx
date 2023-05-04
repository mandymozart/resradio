import { useChannel } from "@ably-labs/react-hooks";
import { gql, useQuery } from '@apollo/client';
import styled from '@emotion/styled';
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from 'react-router-dom';
import Listeners from "../Listeners/Listeners";
import { BroadcastFragment, BroadcastTagsFragment } from './../../../Queries/broadcasts';
import { GetPlaylistQuery, PlaylistFragment, PlaylistTagsFragement } from './../../../Queries/playlists';
import config from "./../../../config";
import PauseBig from "./../../../images/PauseBig";
import PlayBig from "./../../../images/PlayBig";
dayjs.extend(localizedFormat);

const playlistQuery = gql`
${GetPlaylistQuery}
${PlaylistFragment}
${BroadcastFragment}
${BroadcastTagsFragment}
${PlaylistTagsFragement}
`


const Container = styled.div`
h4 { padding: 1rem 2rem; margin: 0;

  span {
    color: red;
  }
}

.controls {
  padding: 1rem 2rem;
  > div {
    display: flex;
    gap: 1rem;
    
  }
  input {
    width: 100%;
  }
  button {
    cursor: pointer;
    height: 4rem;
    width: 4rem;
  }
  border-bottom: 2px solid var(--color); 
}
.list {
  padding: 2rem;
  border-bottom: 2px solid var(--color); 
  .broadcast {
    display: grid;
    grid-template-columns: 1fr 31fr;
    gap: 1rem;
    cursor: pointer;
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

const Player = () => {

    const { uid } = useParams();

    const { loading, error, data } = useQuery(playlistQuery, { variables: { uid: uid } });
    const audioRef = useRef();
    const [current, setCurrent] = useState();
    const [next, setNext] = useState();
    const [source, setSource] = useState();
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState();
    const [currentTime, setCurrentTime] = useState();

    const [broadcasts, setBroadcasts] = useState();
    const [trackProgress, setTrackProgress] = useState(0);
    const intervalRef = useRef();

    // ably websocket
    const [rotationInfo, setRotationInfo] = useState();
    const [channel] = useChannel(config.ABLY_ROTATION_CHANNEL, (message) => {
        setRotationInfo(message)
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

    const getIndex = (broadcast) => {
        const index = broadcasts.findIndex(node => node.broadcast._meta.id === broadcast._meta.id)
        console.log(index, "get index")
        return index
    }

    // send notification to RadioApp/ShortInfo
    const sendRotationMessage = () => {
        channel.publish(config.ABLY_ROTATION_CHANNEL,
            {
                current:
                {
                    begin: dayjs().toISOString(),
                    end: dayjs().add(parseInt(duration), 'seconds'),
                    title: current.title,
                    hostedby: current.hostedby.title,
                    // TODO: remove anything but UID (depends on shortinfo)
                    uid: current._meta.uid
                }, next:
                {
                    title: next.title,
                    hostedby: next.hostedby.title,
                    // TODO: remove anything but UID (depends on short info update)
                    uid: next._meta.uid
                }
            });
    }

    /**
     * 
     * @param {number} index *optional
     */
    const updateBroadcast = (index) => {
        console.log(index, "update")
        const broadcast = index !== undefined ? broadcasts[index].broadcast : getNextBroadcast(getIndex(current))
        console.log("setting current", broadcast, index)
        if (broadcast) {
            setSource(broadcast.audio.url);
            getLengthOfMp3(broadcast.audio.url);
            setCurrent(broadcast);
            setIsPlaying(true);
            setNext(getNextBroadcast(getIndex(broadcast)))
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.load();
                audioRef.current.play();
                startTimer();
                setTrackProgress(audioRef.current.currentTime);
            }
            sendRotationMessage(broadcast)
        }
    }

    // only once
    const loadBroadcast = (broadcast) => {
        if (broadcast) {
            getLengthOfMp3(broadcast.audio.url);
            setSource(broadcast.audio.url);
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.load();
            }
            setCurrent(broadcast)
            setNext(getNextBroadcast(getIndex(broadcast)))
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
    }, [broadcasts])


    const onPlaying = (e) => {
        // TODO: check with length and prepare file change when nessecary
        setCurrentTime(parseInt(e.target.currentTime));
    };

    const getNextBroadcast = (index) => {
        console.log(index, index + 1, broadcasts.length)
        if (index + 1 < broadcasts.length) {
            return broadcasts[index + 1].broadcast
        }
        else {
            return broadcasts[0].broadcast
        }
    }

    const handleEnded = () => {
        // TODO: set next track in playlist
        updateBroadcast()
    }

    const handlePlay = () => {
        audioRef.current.play();
        setIsPlaying(true);
        sendRotationMessage();
        startTimer();
    }

    const handlePause = () => {
        audioRef.current.pause();
        setIsPlaying(false);
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

    if (loading || !broadcasts || !current || !next) return <>Loading...</>;
    if (error) return <>Error : {error.message}</>;
    const playlist = data.allPlaylists.edges[0].node;
    return (
        <Container>
            <h4>{playlist.title} ({broadcasts.length} Broadcasts) {!isPlaying && <span>Paused</span>}</h4>
            <div className='controls'>
                <div>
                    {isPlaying ?
                        <button onClick={() => handlePause()}><PauseBig /></button> :
                        <button onClick={() => handlePlay()}><PlayBig /></button>}
                    <audio ref={audioRef}
                        onTimeUpdate={onPlaying}
                        onCanPlay={onCanPlay}
                        onEnded={handleEnded}>
                        <source src={source} type='audio/mpeg'></source>
                    </audio>
                    <div>{current?.hostedby.title} &mdash; {current?.title}</div>
                    <div>
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
                            <div>{index}</div> <div>{node.broadcast.hostedby.title} &mdash; {node.broadcast.title}</div>
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