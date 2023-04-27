import styled from "@emotion/styled";
import useFilterStore, { initialState } from "../../Stores/FilterStore";
import ClearSmall from "../../images/ClearSmall";
import Genre from "./Genre";

const Container = styled.div`
flex:1;
min-height: 4rem;
position: relative;
color: var(--color);
.list {
  padding: 2rem;
}
.tag {
  color: var(--background);
  font-size: 1rem;
  background-color: var(--color);
  padding: 0 1rem;
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  font-family: var(--font-light);
  text-transform: uppercase;
  line-height: 2rem;
  margin-right: 0;
  cursor: pointer;
  margin-bottom: 0.5rem;
  white-space: nowrap;
  margin-right: .5rem;
  &:hover {
    background-color: var(--second);
  }
  &.selected {
    background-color: var(--second);
  }
}
button {
  background: transparent;
  font-size: 1.25rem;
  color: var(--color);
  border: 0;
  font-family: var(--font-light);
}
`;

const FilterSummary = () => {
  const { genres, selectedMood, clearMood, slowest, setSlowest, fastest, setFastest, reset, isDirty } = useFilterStore();

  return (
    <Container>
      <div className="list">
        {selectedMood ? <span className="tag tag--mood" onClick={() => clearMood()}>
          <span>
            {selectedMood.name}
          </span>
          <ClearSmall />
        </span> : <></>}
        {genres?.map(genre =>
          <Genre key={genre}
            genre={genre}
          />
        )}
        {(slowest !== initialState.slowest || fastest !== initialState.fastest) && (
          <span className="tag tag--tempo" onClick={() => { setSlowest(initialState.slowest); setFastest(initialState.fastest) }}>
            <span>

              {slowest}&mdash;{fastest} BPM
            </span>
            <ClearSmall />
          </span>
        )}
        {isDirty() ? (
          <button onClick={() => reset()}>Reset</button>
        ) : <>Select filters to dive into our broadcast archive!</>}
      </div>
    </Container>
  )
}

export default FilterSummary