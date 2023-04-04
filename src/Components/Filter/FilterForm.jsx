import styled from "@emotion/styled";
import Select from 'react-select';
import { genreOptions, moodOptions, tempoOptions } from "./filterOptions";

const Container = styled.div`
width: calc(50% - 6rem);
grid-template-columns: 1fr 1fr 1fr 1fr;
gap: 2rem;
padding: 2rem 2rem;
background: var(--second);
text-transform: uppercase;
color: var(--background);
label {
    > span {
        display: block;
        margin-bottom: 0.5rem;
    }
}
div {
    border: 2px solid var(--background);
    background: transparent;
}
* {
    border-radius: 0;
}
margin-bottom: 2rem;
`;

export const FilterForm = () => {
    return (
        <Container>
            <label>
                <span>
                    Genres:
                </span>

                <Select isMulti options={genreOptions} />
            </label>
            <label>
                <span>
                    Moods:
                </span>

                <Select isMulti options={moodOptions} />
            </label>
            <label>
                <span>
                    Tempo:
                </span>

                <Select isMulti options={tempoOptions} />
            </label>
        </Container>
    )
}

