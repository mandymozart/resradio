import styled from "@emotion/styled";

export const Input = styled.input`
  background-color: var(--background);
  border: 1px solid var(--color);
  border-radius: .1rem;
  &:focus {
      border: 1px solid var(--second);
  }
`;
