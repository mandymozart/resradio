import styled from "@emotion/styled";
import { BREAKPOINT_XS } from "../../config";

export const Header2 = styled.h2`
  padding: 2rem 2rem 0 2rem;
  @media (max-width: ${BREAKPOINT_XS}px) {
    padding: 1rem 1rem 0 1rem;
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
`