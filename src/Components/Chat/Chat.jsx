import styled from "@emotion/styled";
import WidgetBot from "@widgetbot/react-embed";
import React from "react";

const Container = styled.div``;

const Chat = () => {
  return (
    <Container>
      hello
      <WidgetBot
    server="299881420891881473"
    channel="355719584830980096"
  />
    </Container>
  );
};

export default Chat;
