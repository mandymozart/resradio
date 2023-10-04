import { useChannel } from '@ably-labs/react-hooks';
import styled from '@emotion/styled';
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ABLY_ROTATION_CHANNEL, BREAKPOINT_XS, FUNCTIONS } from "../../../config";
import PauseBig from "../../../images/PauseBig";
import PlayBig from "../../../images/PlayBig";
import { formatTime, getQueryString } from "../../../utils";
import ProgressBar from "../../AudioPlayer/ProgressBar";
import SectionLoader from "../../SectionLoader";
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

    const intervalRef = useRef();

    // rotation socket
    const [rotationChannel] = useChannel(ABLY_ROTATION_CHANNEL, () => { });

    const getPreviousIndex = (broadcast) => {
        const b = broadcasts.find(node => node.broadcast._meta.id === broadcast._meta.id)
        if (b.index - 1 > 0) {
            return b.index - 1
        }
        else {
            return broadcasts[broadcasts.length - 1].index
        }
    }
    const getNextIndex = (broadcast) => {
        const next = broadcasts.find(node => node.broadcast._meta.id === broadcast._meta.id)
        if (next.index + 1 < broadcasts.length) {
            return next.index + 1
        }
        else {
            return 1
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
        const broadcast = index !== undefined ? broadcasts.find(b => b.index === index).broadcast : broadcasts.find(b => b.index === i).broadcast
        setCurrentIndex(index ? index : i);
        const nI = getNextIndex(broadcast);
        console.log(nI)
        const nextBroadcast = broadcasts.find(b => b.index === nI).broadcast;
        if (broadcast) {
            setSource(broadcast.audio);
            setDuration(broadcast.duration ? broadcast.duration : broadcast.length ? broadcast.length * 60 : 3600);
            setCurrentTime(0);
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

    useEffect(() => {
        // Pause and clean up on unmount
        return () => {
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
                {broadcasts.map((broadcast) => {
                    return (
                        <div key={broadcast.index}
                            onClick={() => updateBroadcast(broadcast.index)}
                            className={broadcast.index === currentIndex ? "broadcast current" : "broadcast"}>
                            <div className="index">{broadcast.index}</div>
                            <div className="title">{broadcast.broadcast.hostedby?.title} &mdash; {broadcast.broadcast?.title}</div>
                            <div className="duration">{broadcast.broadcast?.duration ? formatTime(broadcast.broadcast?.duration) : formatTime(broadcast.broadcast?.length * 60)}</div>
                        </div>
                    )
                }
                )}
            </div>
        </Container>
    )
}

export default StudioPlayer;