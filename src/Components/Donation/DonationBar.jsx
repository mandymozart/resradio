import styled from "@emotion/styled"
import React, { useState } from "react"
import { Link } from "react-router-dom"
import ClearSmall from "../../images/ClearSmall"

const Container = styled.section`
background-color: var(--second);
color: var(--background);
padding: 2rem;
font-size: 1.5rem;
font-family: var(--font-light);
display: flex;
gap:2rem;
justify-content: space-between;
button {
    border: 1px solid var(--background);
    line-height: 2rem;
    word-break: keep-all;
    padding: 0 1rem;
    cursor: pointer;
    &.primary {
        background-color: var(--background);
        color: var(--second);
    }
    &.secondary {
        background-color: var(--second);
        color: var(--background);
    }
}
`

const DonationBar = () => {
    const [visible, setVisible] = useState(true);

    if (!visible) return <></>
    return (
        <Container>
            <div>
                DONATE if you wanna support our community web radio and help us keep the airwaves alive!
            </div>
            <Link to="/page/donate">
                <button className="primary">Click to donate</button>
            </Link>
            <button className="secondary" onClick={() => setVisible(false)}>Okay, next time! <ClearSmall /></button>

        </Container>
    )
}

export default DonationBar;