import styled from "@emotion/styled";
import { Realtime } from "ably";
import dayjs from "dayjs";
import React, { useState } from "react";
import { ABLY_KEY, ABLY_ROTATION_CHANNEL } from "../../config";

const Container = styled.div`

`

const RotationInfo = () => {
    // rotation socket
    const [rotationInfo, setRotationInfo] = useState();
    const [items, setItems] = useState();

    var realtime = new Realtime(ABLY_KEY);
    var channel = realtime.channels.get(`[?rewind=1]${ABLY_ROTATION_CHANNEL}`);
    channel.subscribe(function (message) {
        console.log("last message", message.data)
        setRotationInfo(message)
    });
    // useChannel(ABLY_ROTATION_CHANNEL, (message) => {
    //     setRotationInfo(message)
    // });
    return (<Container>
        <h6>Status</h6>
        {rotationInfo ? (
            <>
                {dayjs(rotationInfo.data.current.begin).format("ddd, HH:mm")} - {dayjs(rotationInfo.data.current.end).format("HH:mm")} {rotationInfo.data.current.hostedby} &mdash; {rotationInfo.data.current.title}
            </>
        ) : (<>Currently not playing</>)}
        { }
    </Container>)
}

export default RotationInfo;