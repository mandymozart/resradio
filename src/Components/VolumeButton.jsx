import styled from '@emotion/styled'
import React, { useRef, useState } from 'react'
import { isDesktop } from 'react-device-detect'
import Volume from '../images/Volume'
import useAudioPlayerStore from '../Stores/AudioPlayerStore'

const Container = styled.div`
    position: relative;
`

const VolumeSlider = styled.div`
position: absolute;
top: 5rem;
  input {
    writing-mode: bt-lr; /* IE */
    -webkit-appearance: slider-vertical; /* WebKit */
    width: 1rem;
    height: 6rem;
    padding: 0 0.25rem;
  }
`;

const VolumeButton = () => {
    const { volume, setVolume } = useAudioPlayerStore();
    const [showVolumeSlider, setShowVolumeSlider] = useState(false);
    const volumeSlider = useRef();

    const toggleVolumeSlider = () => {
        setShowVolumeSlider(!showVolumeSlider);
    };

    const changeVolume = (e) => {
        // send volumen changed event to window, all players will listen to this.
        // setVolume(volume)
        const event = new CustomEvent('volumenChanged', { value: e.target.value });
        window.dispatchEvent(event);
    };

    return (
        <Container>
            {isDesktop && (
                <>
                    <button onClick={toggleVolumeSlider}>
                        <Volume volume={volume} />
                    </button>

                    {showVolumeSlider && (
                        <VolumeSlider>
                            <input
                                orient="vertical"
                                type="range"
                                max="1"
                                min="0"
                                value={volume}
                                step="0.01"
                                ref={volumeSlider}
                                onChange={changeVolume}
                            />
                        </VolumeSlider>
                    )}
                </>
            )}
        </Container>
    )
}

export default VolumeButton;