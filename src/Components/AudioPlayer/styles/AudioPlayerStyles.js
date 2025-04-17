import styled from '@emotion/styled';
import { BREAKPOINT_MD, BREAKPOINT_XS } from '../../../config';

export const Container = styled.div`
  padding: 0 2rem;
  @media (max-width: ${BREAKPOINT_XS}px) {
    padding: 0 1rem;
  }

  border-bottom: 2px solid var(--color);

  button {
    cursor: pointer;
  }
  > header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    overflow: hidden;
    gap: 0rem;
    line-height: 3rem;
    @media (max-width: ${BREAKPOINT_MD}px) {
      display: flex;
    }
  }

  .status {
    color: var(--second);
    box-sizing: border-box;
    text-transform: uppercase;
    white-space: nowrap;
    display: flex;
    height: 100%;
    justify-content: center;
    align-items: center;
    svg {
      height: 1.25rem;
      width: 1.25rem;
    }
    @media (max-width: ${BREAKPOINT_MD}px) {
      .appendix {
        display: none;
      }
    }
    @media (max-width: ${BREAKPOINT_XS}px) {
      .now {
        display: none;
      }
    }
  }

  .info-container {
    flex: 1;
    overflow: hidden;
  }

  .stream-status-message {
    display: flex;
    flex-direction: row;
    padding: 0 1rem;
    overflow: hidden;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export const PlayButton = styled.button`
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: end;
  padding: 0;
  background: none;
  border: none;
  color: var(--color);
  font-size: 1.5rem;

  @media (max-width: ${BREAKPOINT_MD}px) {
    justify-content: flex-start;
  }
  @media (max-width: ${BREAKPOINT_XS}px) {
    width: 2rem;
  }

  svg {
    width: 2rem;
    height: 1.5rem;
  }

  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;