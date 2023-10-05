import styled from "@emotion/styled";
import useFilterStore from "../../Stores/FilterStore";
import Clear from "../../images/Clear";

export const Container = styled.span`
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
`;

const Genre = ({ genre, children }) => {
  const { genres, addGenre, removeGenre } = useFilterStore();

  function toggle(genre) {
    if (genres.find(g => g === genre) === undefined) {
      addGenre(genre);
    } else {
      removeGenre(genre)
    }
  }
  return (
    <Container className={genres.find(g => g === genre) ? "selected" : ""} onClick={() => toggle(genre)}>
      <span>
        {genre}
        {children}
      </span>
      {genres.find(g => g === genre) ? <Clear /> : ""}
    </Container>
  );
}

export default Genre;