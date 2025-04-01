import styled from "@emotion/styled";
import React from "react";
import useFilterStore from "../../Stores/FilterStore";
import { BREAKPOINT_XS } from "../../config";
import Clear from "../../images/Clear";

const Container = styled.div`
padding: 2rem;
border: 2px solid var(--color);
text-align: center;
color: var(--color);
text-transform: initial;
position: relative;
@media (max-width: ${BREAKPOINT_XS}px) {
    padding: 1rem;
}
&.selected {
    color: var(--background);
    border-color: var(--color);
    background-color: var(--color);
}
&:hover {
    color: var(--background);
    border-color: var(--second);
    background-color: var(--second);
    cursor: pointer;
}
h4 {
    font-size: 1rem;
    font-family: var(--font-light);
    margin: 0;
    margin-bottom: 1rem;
    @media (max-width: ${BREAKPOINT_XS}px) {
    margin-bottom: .5rem;
}
}
p {
    font-size: 1rem;
    margin: 0;
    font-family: var(--font-light);
}
svg {
    position: absolute;
    top: 1rem;
    right: 1rem;
}
`

const Mood = ({ mood }) => {
    const { selectedMood, setMood, clearMood } = useFilterStore();

    function toggle(mood) {
        if (selectedMood?._meta.id !== mood._meta.id) {
            setMood(mood);
        } else {
            clearMood()
        }
    }

    return (<Container
        className={selectedMood?._meta.id === mood?._meta.id ? "selected" : ""}
        onClick={() => toggle(mood)}>
        <h4>{mood?.name}</h4>
        <p>{mood?.description}</p>
        {selectedMood?._meta.id === mood?._meta.id ? <Clear /> : <></>}
    </Container>)
}

export default Mood;