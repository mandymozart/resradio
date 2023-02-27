import styled from "@emotion/styled"
import Select from 'react-select';
import filterOptions, { genreOptions, moodOptions, tempoOptions } from "./filterOptions"

const Container = styled.div``;

export const FilterForm = () => {
    return (
        <Container>
            <label>
                Genres:
                <Select isMulti options={genreOptions} />
            </label>
            <label>
                Moods:
                <Select isMulti options={moodOptions} />
            </label>
            <label>
                Tempo:
                <Select isMulti options={tempoOptions} />
            </label>
        </Container>
    )
}

