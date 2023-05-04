import { usePresence } from "@ably-labs/react-hooks";
import styled from '@emotion/styled';
import React from "react";

const Container = styled.div`
h6 { 
  font-size: 1rem;
  padding: 1rem 0; margin: 0;
}`

const Listeners = () => {
    const [presenceData] = usePresence("rotation", "host");
    const members = presenceData.map((msg, index) => <li key={index}>{msg.clientId}: {msg.data}</li>);
    return (<Container>
        <h6>Active visitors ({presenceData.filter(m => m.data !== "listener").length})</h6>
        {members}
        <h6>Listener ({presenceData.filter(m => m.data === "listener").length})</h6>
        {presenceData.filter(m => m.data === "listener").map(msg => <li>${msg.clientId}</li>)}
    </Container>)
}

export default Listeners;