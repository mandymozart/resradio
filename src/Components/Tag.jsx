import styled from "@emotion/styled";

export const Tag = styled.span`
  color: var(--background);
  font-size: 1rem;
  background-color: var(--color);
  padding: 0 1rem;
  display: inline-block;
  font-family: var(--font-bold);
  text-transform: uppercase;
  line-height: 2rem;
  margin-right: 0;
  cursor: pointer;
  margin-bottom: 0.5rem;
  white-space: nowrap;
  &:hover {
    background-color: var(--second)
  }
`;
export default Tag;
