import styled from '@emotion/styled';
import { BREAKPOINT } from '../../config';

export const PasswordTip = styled.span`
  color: var(--color-dark-lighter);
  font-size: var(--font-size-xs);

  @media (max-width: ${BREAKPOINT}px) {
    font-size: var(--font-size-xxs);
  }
`;
