import styled from "@emotion/styled";
import WidgetBot from "@widgetbot/react-embed";
import React, { useState } from "react";
import { BsChat } from "react-icons/bs";
import { FaCross } from "react-icons/fa";

const Container = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  &&& .widgetbot {
    width: 100%;
    border-radius: 0;
  }
`;

const Chat = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Container>
      <button onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <BsChat /> : <FaCross />}
      </button>
      {isOpen && (
        <WidgetBot
          className="widgetbot"
          server="299881420891881473"
          channel="355719584830980096"
        />
      )}
    </Container>
  );
};

export default Chat;
