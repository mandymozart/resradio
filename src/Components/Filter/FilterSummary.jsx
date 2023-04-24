import styled from "@emotion/styled";
import useFilterStore from "../../Stores/FilterStore";
import Cross from "../../images/Cross";
import Tag from "../Tag";

const Container = styled.div`
flex:1;
min-height: 4rem;
position: relative;
.list {
  padding: 2rem;
}
button {
  background: transparent;
  font-size: 1.25rem;
  color: var(--color);
  border: 0;
  font-family: var(--font-light);
  position: absolute;
  top: 2rem;
  right: 2rem;
}
`;

const FilterSummary = () => {
  const { moods, removeMood, tempos, removeTempo, genres, removeGenre, reset } = useFilterStore();
  return (
    <Container>
      <div className="list">
        {moods.map((tag, index) => {
          return (
            <span key={"tag" + index} onClick={() => removeMood(tag.value)}>
              <Tag>{tag.label}<Cross /></Tag>{" "}
            </span>
          )
        })}
        {genres.map((tag, index) => {
          return (
            <span key={"tag" + index} onClick={() => removeGenre(tag.value)}>
              <Tag>{tag.label} <Cross /></Tag>{" "}
            </span>
          )
        })}
        {tempos.map((tag, index) => {
          return (
            <span key={"tag" + index} onClick={() => removeTempo(tag.value)} >
              <Tag>{tag.label} <Cross /></Tag>{" "}
            </span>
          )
        })}
      </div>
      {/* <button onClick={() => reset()}>Reset</button> */}
    </Container>
  )
}

export default FilterSummary