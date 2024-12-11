import { useChannel } from "@ably-labs/react-hooks";
import styled from "@emotion/styled";
import dayjs from "dayjs";
import React, { useState } from "react";
import { ABLY_ROTATION_CHANNEL } from "../../config";

const Container = styled.div`

`

const RotationInfo = () => {
    // rotation socket
    const [rotationInfo] = useState();

    const [_] = useChannel(`[?rewind=1]${ABLY_ROTATION_CHANNEL}`, (_) => {
        // This call will rewind 100 messages
        // console.log(message);
    });
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