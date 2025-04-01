import dayjs from "dayjs";
import React, { useState } from "react";

const RotationInfo = () => {
    // rotation socket
    const [rotationInfo] = useState();

    return (<div>
        <h6>Status</h6>
        {rotationInfo ? (
            <>
                {dayjs(rotationInfo.data.current.begin).format("ddd, HH:mm")} - {dayjs(rotationInfo.data.current.end).format("HH:mm")} {rotationInfo.data.current.hostedby} &mdash; {rotationInfo.data.current.title}
            </>
        ) : (<>Currently not playing</>)}
        { }
    </div>)
}

export default RotationInfo;