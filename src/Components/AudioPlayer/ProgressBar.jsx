import styled from "@emotion/styled";
import React, { useState, useEffect, useRef } from "react";
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
    border-bottom-left-radius: 0.5rem;
    border-top-left-radius: 0.5rem;
    height: 0.5rem;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
}

/* played progress length - firefox */
input[type=range]::-moz-range-progress {
    background: var(--second);
    border-bottom-left-radius: 0.5rem;
    border-top-left-radius: 0.5rem;
    height: 0.5rem;
}

/* slider thumb - chrome and safari */
input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none;
    border: none;
    height: 1.5rem;
    width: 1.5rem;
    border-radius: 50%;
    background-color: var(--background);
    cursor: grab;
    position: relative;
    z-index: 1;
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
    border-radius: 50%;
    background-color: var(--background);
    cursor: grab;
    position: relative;
    z-index: 1;
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
    onLoadingChange,
    className,
}) => {
    // Add state to track the visual position during dragging
    const [sliderValue, setSliderValue] = useState(timeProgress);
    const [isDragging, setIsDragging] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Update slider value when timeProgress changes (only if not dragging)
    useEffect(() => {
        if (!isDragging) {
            setSliderValue(timeProgress);
        }
        
        // Always update the CSS variable for progress bar appearance
        updateSliderProgress();
    }, [timeProgress, isDragging]);

    // Update when duration changes
    useEffect(() => {
        updateSliderProgress();
    }, [duration]);

    // Notify parent component when loading state changes
    useEffect(() => {
        if (onLoadingChange) {
            onLoadingChange(isLoading);
        }
    }, [isLoading, onLoadingChange]);

    // Listen for the canplay event to know when audio has loaded
    useEffect(() => {
        const audio = audioRef.current;
        
        const handleCanPlay = () => {
            setIsLoading(false);
        };
        
        if (audio) {
            audio.addEventListener('canplay', handleCanPlay);
            audio.addEventListener('playing', handleCanPlay);
            audio.addEventListener('waiting', () => setIsLoading(true));
        }
        
        return () => {
            if (audio) {
                audio.removeEventListener('canplay', handleCanPlay);
                audio.removeEventListener('playing', handleCanPlay);
                audio.removeEventListener('waiting', () => setIsLoading(true));
            }
        };
    }, [audioRef]);

    // Update slider progress visually
    const updateSliderProgress = () => {
        if (progressBarRef.current && duration) {
            const progress = (sliderValue / duration) * 100;
            progressBarRef.current.style.setProperty('--range-progress', `${progress}%`);
        }
    };

    // Handle input changes during dragging
    const handleProgressInput = (e) => {
        const value = parseInt(e.target.value);
        setSliderValue(value);
        updateSliderProgress();
    };

    // Handle mouse down on slider
    const handleMouseDown = () => {
        setIsDragging(true);
    };

    // Handle releasing slider, update actual audio time
    const handleMouseUp = () => {
        if (audioRef.current) {
            setIsLoading(true); // Set loading state when seeking
            audioRef.current.currentTime = sliderValue;
        }
        setIsDragging(false);
    };

    return (
        <Container className={`progress ${className || ''}`}>
            <span className="time current">
                {formatTime(isDragging ? sliderValue : timeProgress)}
            </span>
            <input
                type="range"
                ref={progressBarRef}
                min={0}
                max={duration ? duration : 3600}
                value={sliderValue}
                onInput={handleProgressInput}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onTouchStart={handleMouseDown}
                onTouchEnd={handleMouseUp}
                style={{ cursor: isDragging ? 'grabbing' : 'pointer' }}
            />
            <span className="time duration">
                {duration !== null ? formatTime(duration) : "--:--"}
            </span>
        </Container>
    );
};

export default ProgressBar;