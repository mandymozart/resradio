import styled from '@emotion/styled'

import React, { useRef, useState } from 'react'
import { isDesktop } from 'react-device-detect'
import Slider from 'react-slider'
import { useOnClickOutside } from 'usehooks-ts'
import useAudioPlayerStore from '../Stores/AudioPlayerStore'
import Volume from '../images/Volume'

const Container = styled.div`
    position: relative;
    button { 
        cursor: pointer;
    }
`

const VolumeSlider = styled.div`
position: absolute;
top: 3rem;
padding: 1rem;
background: var(--background);
border: 1px solid var(--color);
transform: translateX(-0.75rem);
border-radius: .1rem;

/* Styles for the slider component */
.slider {
        width: 0.5rem;
    height: 10rem;
    background-color: var(--color);
    border-radius: 1rem;
    }

/* Styles for the slider thumb */
.slider .thumb {
    height: 1.5rem;
    width: 1.5rem;
    transform: translate(-0.5rem,.5rem);
    border-radius: 50%;
    background-color: var(--color);
    cursor: grab;
    box-shadow: none;
    &.thumb-1 {
        transform: translate(0.5rem,-0.5rem);
    }
}

/* Styles for the slider active state */
.slider .thumb.active {
    background-color: var(--second);
    box-shadow: none;
}
.slider .track-1 {
    background: var(--grey);
    border-radius: .5rem;
    width: 0.5rem;
}
.slider .track-2,
.slider .track-0 {
    background: none;
    height: 0.5rem;
    border-radius: .5rem;
}
`;

const VolumeButton = () => {
    const { volume, setVolume } = useAudioPlayerStore();
    const [showVolumeSlider, setShowVolumeSlider] = useState(false);
    const ref = useRef();

    const toggleVolumeSlider = () => {
        setShowVolumeSlider(!showVolumeSlider);
    };

    const changeVolume = (e) => {
        setVolume(parseFloat(e.target.value))
    };

    const handleClickOutside = () => {
        setShowVolumeSlider(false);
    }

    useOnClickOutside(ref, handleClickOutside)

    return (
        <Container>
            {isDesktop && (
                <>
                    <button onClick={toggleVolumeSlider}>
                        <Volume volume={volume} />
                    </button>

                    {showVolumeSlider && (
                        <VolumeSlider ref={ref}>
                            <div>
                                <Slider orientation='vertical'
                                    className="slider"
                                    value={volume}
                                    onMouseUp={changeVolume}
                                    onAfterChange={(value) => setVolume(value)}
                                    invert
                                    min={0}
                                    max={1}
                                    step={0.01}

                                />
                            </div>
                        </VolumeSlider>
                    )}
                </>
            )}
        </Container>
    )
}

export default VolumeButton;