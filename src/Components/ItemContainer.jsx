import styled from "@emotion/styled";

export const ItemContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
  line-height: 1.1rem;
  margin-bottom: 2rem;
  gap: 3rem;
  @media only screen and (max-width: 600px) {
    gap: 1rem;
  }

  .image {
    flex: 0 0 10rem;
    @media only screen and (max-width: 600px) {
      flex: 0 0 7rem;
    }
    &:hover {
      transition: all 0.4s ease-in-out;
    }
  }
  .meta {
    flex: 1;
    h4 {
      font-size: 1.1rem;
      line-height: 1.2;
      margin: 0;
    }
    span {
      font-size: 1.1rem;
      line-height: 1.1rem;
    }
    p {
      margin-bottom: 0;
    }
  }
`;
