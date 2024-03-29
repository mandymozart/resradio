import styled from "@emotion/styled";
import React from "react";
import { formatTime } from "../../utils";

const Container = styled.div`
display: flex;
align-items: center;
flex: calc(50% - 8rem);
gap: 1.5rem;
.time {
    white-space: nowrap;
    font-size: .75rem;
    width: 4rem;
    text-align: center;
    &.duration {

    }
}
input[type=range] {
    --range-progress: 0;
    -webkit-appearance: none;
    position: relative;
    height: 0.5rem;
    width: 100%;
    background-color: var(--background);
    border-radius: 1rem;
    cursor: pointer;
}

/* Input range - firefox */
input[type=range]::-moz-range-track {
    position: relative;
    width: 100%;
    background-color: var(--background);
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
    background-color: var(--background);
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

    return (
        <Container className="progress">
            <span className="time current">{formatTime(timeProgress)}</span>
            <input
                type="range"
                ref={progressBarRef}
                max={duration ? duration : 3600}
                onChange={handleProgressChange}
                value={timeProgress}
            />
            <span className="time duration">{duration !== null ? formatTime(duration) : "--:--"}</span>
        </Container>
    );
};

export default ProgressBar;