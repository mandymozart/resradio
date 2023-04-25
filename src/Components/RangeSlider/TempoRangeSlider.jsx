import styled from '@emotion/styled';
import React from 'react';
import { DebounceInput } from 'react-debounce-input';
import Slider from 'react-slider';
import useFilterStore from '../../Stores/FilterStore';

const Container = styled.div`
    width: 75%;
    display: flex;
    gap: 2rem;
    justify-content: center;
    align-items: center;
    margin-bottom: 2rem;
    &.default {
        opacity: 0.5;
    }

    input[type=number] {
        text-align: center;
        width: 6rem;
        border:none;
        outline: none;
        font-family: var(--font-medium);
        font-size: 1.25rem;
        background: none;
        line-height: 2rem;
        padding: 0 .5rem;
        &:hover {
            color: var(--second);
        }
        &:focus, &:focus-visible {
            border:none;
            outline: none;
        }

    }

    /* Styles for the slider component */
    .slider {
        height: 0.5rem;
    width: 100%;
    background-color: var(--grey);
    border-radius: 1rem;
    }

    /* Styles for the slider thumb */
    .slider .thumb {
        height: 1.5rem;
        width: 1.5rem;
        transform: translate(-0.5rem, -0.5rem);
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
        background: var(--color);
        border-radius: .5rem;
        height: 0.5rem;
    }
    .slider .track-2,
    .slider .track-0 {
        background: none;
        height: 0.5rem;
        border-radius: .5rem;
    }
`
const min = 30;
const max = 270;
const TempoRangeSlider = () => {
    const { slowest, setSlowest, fastest, setFastest } = useFilterStore();
    const handleChange = (newValues) => {
        newValues[0] = Math.max(min, Math.min(max, Number(newValues[0])))
        newValues[1] = Math.max(min, Math.min(max, Number(newValues[1])))
        setSlowest(newValues[0]);
        setFastest(newValues[1]);
    }
    return (
        <Container className={slowest === min && fastest === max ? "default" : ""}>
            <DebounceInput
                type="number"
                max={max}
                min={min}
                step={10}
                debounceTimeout={300}
                minLength={2}
                value={slowest}
                onChange={(e) => handleChange([+e.target.value, fastest])}
            />
            <Slider
                className="slider"
                value={[slowest, fastest]}
                onChange={handleChange}
                min={min}
                max={max}
            />
            <DebounceInput
                step={10}
                type="number"
                max={max}
                min={min}
                debounceTimeout={300}
                minLength={2}
                value={fastest}
                onChange={(e) => handleChange([slowest, +e.target.value])}
            />
        </Container>
    );
};

export default TempoRangeSlider