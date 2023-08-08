import { useChannel } from "@ably-labs/react-hooks";
import styled from "@emotion/styled";
import React, { useState } from "react";
import { useNetlifyIdentity } from "react-netlify-identity";
import { ABLY_REMOTE_CHANNEL, ABLY_ROTATION_CHANNEL } from "../../../config";
import Button from "../../Button";
import SectionLoader from "../../SectionLoader";

const Container = styled.div`
h3 {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
    margin: 2rem;
    .controls {
        padding: 1rem;
        background: var(--color);
    }
`

const Label = styled.div`
    border-radius: .1rem;
    background-color: var(--second);
    font-size: 1rem;
    text-transform: none;
    padding: 0 1rem;
    color: var(--background);
`

const outgoingMethod = {
    PLAY: "play", PAUSE: "pause", NEXT: "next", PREVIOUS: "previous", CONNECT: "connect", CLOSE: "close"
}
const incomingMethod = {
    AUTHORIZE: "authorize",
    CONNECTION_CLOSED: "connection_closed",
    BLOCKED: "blocked"
}

export const RemoteMethods = {
    outgoing: outgoingMethod,
    incoming: incomingMethod
}

const Remote = () => {
    const [message, setMessage] = useState();
    const { user } = useNetlifyIdentity();

    // channels
    const [remoteChannel] = useChannel(ABLY_REMOTE_CHANNEL, (message) => {
        if (message.data.method === incomingMethod.AUTHORIZE) {
            return authorize(message.data)
        }
        if (message.data.method === incomingMethod.CONNECTION_CLOSED) {
            setAuthorized(false);
            setToken(null);
            return
        }
        if (message.data.method === incomingMethod.BLOCKED) {
            alert("Remote access is blocked by the studio. Contact host on sight for clearance!")
            setAuthorized(false);
            setToken(null)
            setLoading(false);
        }
    });
    useChannel(ABLY_ROTATION_CHANNEL, (message) => {
        setMessage(message)
    });

    // incoming methods
    const authorize = (data) => {
        if (data.status === "ok") {
            setAuthorized(true);
            setToken(data.token);
            setLoading(false);
            return
        }
        if (data.status === "unauthorized") {
            alert("You Token is expired! Connection with studio server is lost! Please reconnect and try again.");
            setAuthorized(false);
            setToken(null);
            setLoading(false);
            return
        }
        console.error("authorization error", data)
        setLoading(false);
    }
    const remote = async (method) => {
        const message = {
            method: method,
            user: user,
            token: token
        }
        remoteChannel.publish(ABLY_REMOTE_CHANNEL, message);

    }

    const [loading, setLoading] = useState(false);
    const [authorized, setAuthorized] = useState(false);
    const [token, setToken] = useState();
    const connect = () => {
        setLoading(true);
        remote(outgoingMethod.CONNECT)
    }





    return (<Container>
        <h3>Remote         {authorized && (<Label>Online</Label>)}</h3>
        <p>Remote connection is a dangerous tool! Be aware that you have complete power over the stream. If there is no playlist open in the studio, you won't be able to do anything. But when you have control, you can fuck things up. In the worst case, just press play!</p>
        <div className="controls">
            {authorized && (<>
                <Button onClick={() => remote(outgoingMethod.PREVIOUS)}>Previous</Button>
                <Button onClick={() => remote(outgoingMethod.PLAY)}>Play</Button>
                <Button onClick={() => remote(outgoingMethod.NEXT)}>Next</Button>
                <Button onClick={() => remote(outgoingMethod.PAUSE)}>Pause</Button>
            </>)}
            {/* <button onClick={() => remote(outgoingMethod.NEXT)}>Next</button>
            <button onClick={() => remote(outgoingMethod.PREVIOUS)}>Previous</button> */}
            {authorized ? <Button onClick={() => remote(outgoingMethod.CLOSE)}>Close</Button> : <Button onClick={() => connect()}>Connect</Button>}

        </div>
        <div className="meta">
            <div className="current">{message?.data?.current.title}</div>
            <div className="next">{message?.data?.next.title}</div>
        </div>
        {loading && <SectionLoader />}

    </Container>)
}

export default Remote;