import styled from "@emotion/styled";
import FadeIn from "../Animations/FadeIn";
import RandomShape from "./RandomShape";

const Container = styled.p`
  text-align: center;
  img {
    margin: 3rem auto;
    width: 7rem;
  }
`;
const Divider = () => {
  return (
    <FadeIn>
      <Container>
        <RandomShape/>
      </Container>
    </FadeIn>
  );
};
export default Divider;
