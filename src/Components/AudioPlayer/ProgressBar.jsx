import styled from "@emotion/styled";
import React from "react";
import { BREAKPOINT_XS } from "../../config";

const Container = styled.div`
display: flex;
align-items: center;
@media (max-width: ${BREAKPOINT_XS}px) {
    grid-area: bottom
}
.time {
    white-space: nowrap;
    font-size: 1rem;
    width: 4rem;
    text-align: center;
    margin-right: 1rem;
    &.duration {
        padding-left: 1rem;
    }
}
input[type=range] {
    --range-progress: 0;
    -webkit-appearance: none;
    position: relative;
    height: 0.5rem;
    width: 100%;
    background-color: var(--color);
    border-radius: 1rem;
    cursor: pointer;
}

/* Input range - firefox */
input[type=range]::-moz-range-track {
    position: relative;
    width: 100%;
    background-color: var(--color);
    border-radius: 1rem;
    cursor: pointer;
}

/* played progress length - Chrome & safari*/
input[type=range]::before {
    content: '';
    background: var(--second);
    width: var(--range-progress);
    border-bottom-left-radius: 50%;
    border-top-left-radius: 50%;
    height: .5rem;
    position: absolute;
    top: 0;
    left: 0;
}

/* played progress length - firefox */
input[type=range]::-moz-range-progress {
    background: var(--second);
    border-bottom-left-radius: 50%;
    border-top-left-radius: 50%;
    height: .5rem;
}

/* slider thumb - chrome and safari */
input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none;

    border: none;
    height: 1.5rem;
    width: 1.5rem;
    /* transform: translate(-0.5rem, -0.5rem); */
    border-radius: 50%;
    background-color: var(--color);
    cursor: grab;
    box-shadow: none;
    position: relative;
}

/* dragging thumb - chrome and safari */
input[type=range]:active::-webkit-slider-thumb {
    transform: scale(1.2);
    background-color: var(--second);
}

/* slider thumb - firefox */
input[type=range]::-moz-range-thumb {
    border: none;
    height: 1.5rem;
    width: 1.5rem;
    /* transform: translate(-0.5rem, -0.5rem); */
    border-radius: 50%;
    background-color: var(--color);
    cursor: grab;
    position: relative;
}
/* dragging thumb - firefox */
input[type=range]:active::-moz-range-thumb {
    transform: scale(1.2);
    background-color: var(--second);
}
`

const ProgressBar = ({
    progressBarRef,
    audioRef,
    timeProgress,
    duration,
}) => {
    const handleProgressChange = () => {
        audioRef.current.currentTime = progressBarRef.current.value;
    };

    const formatTime = (time) => {
        if (time && !isNaN(time)) {
            const minutes = Math.floor(time / 60);
            const formatMinutes =
                minutes < 10 ? `0${minutes}` : `${minutes}`;
            const seconds = Math.floor(time % 60);
            const formatSeconds =
                seconds < 10 ? `0${seconds}` : `${seconds}`;
            return `${formatMinutes}:${formatSeconds}`;
        }
        return '00:00';
    };

    return (
        <Container className="progress">
            <span className="time current">{formatTime(timeProgress)}</span>
            <input
                type="range"
                ref={progressBarRef}
                defaultValue="0"
                max={duration ? duration : 3600}
                onChange={handleProgressChange}
            />
            <span className="time duration">{duration !== null ? formatTime(duration) : "--:--"}</span>
        </Container>
    );
};

export default ProgressBar;