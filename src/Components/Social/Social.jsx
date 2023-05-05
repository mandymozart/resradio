import styled from "@emotion/styled";
import { BsInstagram, BsTelegram } from "react-icons/bs";

const Container = styled.div`
text-align: center;
font-size: 1.5rem;
white-space: nowrap;
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
        href="https://t.me/resradio"
        rel="noreferrer"
        target="_blank"
      >
        <BsTelegram />
      </a>
    </Container>
  );
};

export default Social;