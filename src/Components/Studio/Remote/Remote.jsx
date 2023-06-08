import { useChannel } from "@ably-labs/react-hooks";
import React, { useState } from "react";
import { useNetlifyIdentity } from "react-netlify-identity";
import config from "../../../config";
import SectionLoader from "../../SectionLoader";

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
    const [remoteChannel] = useChannel(config.ABLY_REMOTE_CHANNEL, (message) => {
        console.log("remote method received", message)
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
    const [rotationChannel] = useChannel(config.ABLY_ROTATION_CHANNEL, (message) => {
        console.log("rotation message received", message)
        setMessage(message)
    });

    // incoming methods
    const authorize = (data) => {
        console.log(data)
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
        remoteChannel.publish(config.ABLY_REMOTE_CHANNEL, message);

    }

    const [loading, setLoading] = useState(false);
    const [authorized, setAuthorized] = useState(false);
    const [token, setToken] = useState();
    const connect = () => {
        setLoading(true);
        remote(outgoingMethod.CONNECT)
    }





    return (<>
        <h3>Remote</h3>
        <div className="controls">
            {authorized && (<>
                <button onClick={() => remote(outgoingMethod.PLAY)}>Play</button>
                <button onClick={() => remote(outgoingMethod.PAUSE)}>Pause</button>
            </>)}
            {/* <button onClick={() => remote(outgoingMethod.NEXT)}>Next</button>
            <button onClick={() => remote(outgoingMethod.PREVIOUS)}>Previous</button> */}
            {authorized ? <button onClick={() => remote(outgoingMethod.CLOSE)}>Close</button> : <button onClick={() => connect()}>Connect</button>}

        </div>
        <div className="meta">
            <div className="current">{message?.data?.current.title},</div>
            <div className="next">{message?.data?.next.title}</div>
        </div>
        {loading && <SectionLoader />}
        {authorized && (<>connected</>)}
    </>)
}

export default Remote;