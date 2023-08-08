import { useChannel } from "@ably-labs/react-hooks";
import styled from "@emotion/styled";
import React from "react";

const Container = styled.div`

`

const RotationInfo = () => {
    // rotation socket
    const [rotationInfo, setRotationInfo] = useState();
    useChannel(ABLY_ROTATION_CHANNEL, (message) => {
        setRotationInfo(message)
    });
    return (<Container>
        <h6>Status</h6>
        {rotationInfo ? (
            <>
                {dayjs(rotationInfo.data.begin).format("ddd, HH:mm")} - {dayjs(rotationInfo.data.end).format("HH:mm")} {rotationInfo.data.hostedby} &mdash; {rotationInfo.data.title}
            </>
        ) : (<>Currently not playing</>)}
    </Container>)
}

export default RotationInfo;