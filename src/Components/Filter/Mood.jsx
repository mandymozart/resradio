import styled from "@emotion/styled";
import React from "react";

const Container = styled.div`
padding: 2rem;
border: 2px solid var(--color);
text-align: center;
color: var(--color);
text-transform: initial;
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
}
p {
    font-size: 1rem;
    margin: 0;
    font-family: var(--font-light);
}
`

const Mood = ({ mood, selected }) => {
    console.log(mood)
    return (<Container className={selected ? "selected" : ""}>
        <h4>{mood.name}</h4>
        <p>{mood.description}</p>
    </Container>)
}

export default Mood;