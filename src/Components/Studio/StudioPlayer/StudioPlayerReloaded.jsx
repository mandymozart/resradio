import { useChannel } from "@ably-labs/react-hooks";
import { useLazyQuery } from "@apollo/client";
import styled from '@emotion/styled';
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNetlifyIdentity } from "react-netlify-identity";
import useDebounce from "../../../Hooks/useDebounce.";
import { getBroadcastsQuery } from "../../../Queries/broadcasts";
import { ABLY_REMOTE_CHANNEL, ABLY_ROTATION_CHANNEL, BREAKPOINT_XS, FUNCTIONS, ITEMS_PER_PAGE } from "../../../config";
import PauseBig from "../../../images/PauseBig";
import PlayBig from "../../../images/PlayBig";
import { formatTime, getQueryString } from "../../../utils";
import ProgressBar from "../../AudioPlayer/ProgressBar";
import Button from "../../Button";
import SectionLoader from "../../SectionLoader";
import { RemoteMethods } from "../Remote/Remote";
dayjs.extend(localizedFormat);

const Container = styled.div`
background: var(--color);
color: var(--background);
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
    margin-bottom: 1rem;
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
    height: 2rem;
    width: 2rem;
    font-size: 2rem;
    background-color: transparent;
    font-size: 2rem;
    color: var(--background);
    line-height: 2rem;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    svg {
            height: 1rem;
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
h6 {
  margin: 0 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--background);
  display: flex;
  align-items: center;
  justify-content: space-between;
  div {
    font-size: 1rem;

  }
}
.list {
  padding: 2rem;
  border-bottom: 2px solid var(--color); 
  @media (max-width: ${BREAKPOINT_XS}px) {
        padding: 1rem;
        font-size: 1rem;
    }
  .broadcast {
    display: grid;
    grid-template-columns: 2rem auto 5rem;
    line-height: 1.5rem;
    gap: .5rem;
    font-size: 1rem;
    margin-bottom: .5rem;
    cursor: pointer;
    &.current {
        color: var(--yellow);
        .index {
            background-color: var(--yellow);
        }
    }
    .index {
        font-size: .75rem;
        background-color: var(--grey);
        text-align: center;
        border-radius: .1rem;
        color: var(--color);
    }
    .title {
        white-space: nowrap;
overflow: hidden;
text-overflow: ellipsis;
    } 
    .duration {
        text-align: right;
    }
    &:hover {
      color: var(--second);
    }
  }
}
`
const StudioPlayer = ({ broadcasts, setBroadcasts }) => {


    const audioRef = useRef();
    const progressBarRef = useRef();
    const [current, setCurrent] = useState();
    const [next, setNext] = useState();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [source, setSource] = useState();
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(3600);
    const [currentTime, setCurrentTime] = useState(0);
    const [isBlocked, setIsBlocked] = useState(true);


    const [endCursor, setEndCursor] = useState(null)
    const [isInitial, setIsInitial] = useState(true);
    const [hasNextPage, setHasNextPage] = useState(true);
    const [getData, { loading, error, data }] = useLazyQuery(
        getBroadcastsQuery, {
        variables: {
            itemsPerPage: ITEMS_PER_PAGE,
            currentCursor: endCursor,
        }, onCompleted: (data) => {
            if (isInitial) setIsInitial(false);
            // more pages availables
            setHasNextPage(data.allBroadcastss.pageInfo.hasNextPage)
            const newBroadcasts = []
            data.allBroadcastss.edges.filter(i => i.node.audio?.includes(".mp3")).filter(i => i.node.duration || i.node.length).forEach(i => {
                newBroadcasts.push({ broadcast: i.node })
            })
            console.log("data", newBroadcasts)
            setBroadcasts([...broadcasts, ...newBroadcasts])
        }
    });

    const debouncedRequest = useDebounce(() => {
        getData()
    });

    const loadMore = () => {
        setEndCursor(data?.allBroadcastss.pageInfo.endCursor ? data.allBroadcastss.pageInfo.endCursor : null)
        debouncedRequest();
    }

    const [remote, setRemote] = useState(undefined);
    // const [token, setToken] = useState();
    const intervalRef = useRef();

    // rotation socket
    const [rotationChannel] = useChannel(ABLY_ROTATION_CHANNEL, () => { });

    // remote socket
    const { user } = useNetlifyIdentity();

    const [remoteChannel] = useChannel(ABLY_REMOTE_CHANNEL, (message) => {
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
        rotationChannel.publish(ABLY_ROTATION_CHANNEL, cue);

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
        setCurrentIndex(index ? index : i);
        const nI = getNextIndex(broadcast);
        const nextBroadcast = broadcasts[nI].broadcast;
        if (broadcast) {
            setSource(broadcast.audio);
            setDuration(broadcast.duration ? broadcast.duration : broadcast.length ? broadcast.length * 60 : 3600);
            setCurrentTime(0);
            console.log(currentTime)
            setCurrent(broadcast);
            isPlaying ? setIsPlaying(true) : setIsPlaying(false);
            setNext(nextBroadcast)
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.load();
                if (isPlaying)
                    audioRef.current.play();
            }
            sendRotationMessage(broadcast, nextBroadcast)
        }
    }

    // only once // TODO: can be same as above method
    const loadBroadcast = (broadcast) => {
        if (broadcast) {
            setSource(broadcast.audio);
            setDuration(broadcast.duration > 0 ? broadcast.duration : 3600)
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.load();
            }
            setCurrent(broadcast)
            setNext(broadcasts[getNextIndex(broadcast)].broadcast);
        }
    }

    useEffect(() => {
        loadBroadcast(broadcasts[0].broadcast)
    }, [])


    const onPlaying = (event) => {
        const audioElement = event.target;
        // Perform actions based on the updated time
        setCurrentTime(parseInt(event.target.currentTime));
    };

    // TODO: Increase blocking authorization 
    // const handleUnauthorized = () => {
    //     const data = {
    //         status: "unauthorized",
    //         method: RemoteMethods.incoming.AUTHORIZE
    //     }
    //     remoteChannel.publish(ABLY_REMOTE_CHANNEL, data)
    // }

    const handleConnect = (message) => {
        setRemote(message.connectionId)
        const data = {
            token: "approved",
            status: "ok",
            method: RemoteMethods.incoming.AUTHORIZE,
            user: user
        }
        remoteChannel.publish(ABLY_REMOTE_CHANNEL, data)
    }

    const handleBlocked = () => {
        setIsBlocked(true);
        // const data = {
        //     status: "blocked",
        //     method: RemoteMethods.incoming.BLOCKED,
        //     user: user
        // }
        // remoteChannel.publish(ABLY_REMOTE_CHANNEL, data)
    }

    const handleEnded = () => {

        updateBroadcast()
    }

    const handlePlay = () => {
        audioRef.current.play();
        setIsPlaying(true);
    }

    const handlePause = () => {
        audioRef.current.pause();
        setIsPlaying(false);
    }
    const handleNext = () => {
        updateBroadcast(getNextIndex(current))
    }
    const handlePrevious = () => {
        updateBroadcast(getPreviousIndex(current))
    }
    const handleClose = () => {
        setRemote(undefined)
        const data = {
            method: RemoteMethods.incoming.CONNECTION_CLOSED,
        }
        remoteChannel.publish(ABLY_REMOTE_CHANNEL, data)
    }

    useEffect(() => {
        // Pause and clean up on unmount
        return () => {
            // audioRef.current.pause();
            clearInterval(intervalRef.current);
        };
    }, []);

    const handleTimeUpdate = useCallback(event => {
        const audioElement = event.target;
        // Perform actions based on the updated time
        setCurrentTime(parseInt(audioElement.currentTime));
    }, []);

    const getTotalDuration = () => {
        let totalDuration = 0;
        broadcasts.forEach(i => {
            const duration = i.broadcast.duration ? i.broadcast.duration : i.broadcast.length ? i.broadcast.length * 60 : 3600
            totalDuration = totalDuration + duration
        })
        return formatTime(totalDuration);
    }

    if (!current || !next) return <SectionLoader />;
    return (
        <Container>
            <div className="remote">
                {!isPlaying && <span>Paused</span>}
                {remote && (<>
                    <span style={{ color: "var(--second)" }}>Remote</span>
                </>)}
                {isBlocked ? <Button onClick={() => { setIsBlocked(false); }}>Unblock Remote</Button> : <Button onClick={() => { handleClose(); handleBlocked(); }}>Block</Button>}
            </div>
            <div className='controls'>
                <div>

                    <audio ref={audioRef}
                        onTimeUpdate={handleTimeUpdate}
                        onEnded={handleEnded}>
                        <source src={source} type='audio/mpeg'></source>
                    </audio>
                    <div className="title">{current?.hostedby?.title} &mdash; {current?.title}</div>
                </div>
                <div>
                    <div className="controls-buttons">
                        <button onClick={() => handlePrevious()}>&lt;</button>
                        {isPlaying ?
                            <button onClick={() => handlePause()}><PauseBig /></button> :
                            <button onClick={() => handlePlay()}><PlayBig /></button>}
                        <button onClick={() => handleNext()}>&gt;</button>
                    </div>
                    <ProgressBar progressBarRef={progressBarRef} audioRef={audioRef} timeProgress={currentTime} duration={duration} />
                </div>
            </div>
            <h6>Cue <div>{getTotalDuration()}</div></h6>
            <div className='list'>
                {broadcasts.map((node, index) => {
                    return (
                        <div key={index}
                            onClick={() => updateBroadcast(index)}
                            className={index === currentIndex ? "broadcast current" : "broadcast"}>
                            <div className="index">{index}</div>
                            <div className="title">{node?.broadcast?.hostedby?.title} &mdash; {node.broadcast?.title}</div>
                            <div className="duration">{node.broadcast?.duration ? formatTime(node.broadcast?.duration) : formatTime(node.broadcast?.length * 60)}</div>
                        </div>
                    )
                }
                )}
                {hasNextPage && (<Button onClick={() => loadMore()}>Add random</Button>)}
            </div>

        </Container>
    )
}

export default StudioPlayer;