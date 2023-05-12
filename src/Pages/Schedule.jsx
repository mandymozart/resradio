import React from "react";
import { useParams } from "react-router-dom";
import HeaderOffset from "../Components/HeaderOffset";
import Schedule from "../Components/Schedule/Schedule";

const SchedulePage = () => {

    const { from } = useParams();
    return (<HeaderOffset>
        <Schedule from={from} />

    </HeaderOffset>

    )
}

export default SchedulePage;