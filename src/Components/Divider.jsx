import styled from "@emotion/styled";
import FadeIn from "../Animations/FadeIn";

const Container = styled.div`
  width: 100%;
  border-bottom: 2px solid var(--color);
  margin-bottom: 2rem;
  margin-top: 2rem;
`;
const Divider = () => {
  return (
    <FadeIn>
      <Container>
      </Container>
    </FadeIn>
  );
};
export default Divider;
