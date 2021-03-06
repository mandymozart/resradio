import styled from "@emotion/styled";
import { BsFacebook, BsInstagram } from "react-icons/bs";

const Container = styled.p`
text-align: center;
font-size: 2rem;
`;

const Social = () => {
  return (
    <Container>
      <a
        href="https://www.instagram.com/res.radio"
        rel="noreferrer"
        target="_blank"
      >
        <BsInstagram />
      </a>{" "}
      <a
        href="https://www.facebook.com/res.radio.V"
        rel="noreferrer"
        target="_blank"
      >
        <BsFacebook />
      </a>
    </Container>
  );
};

export default Social;