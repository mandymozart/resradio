import styled from "@emotion/styled"
import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import FadeIn from "../../Animations/FadeIn"
import useLocalStorage from "../../Hooks/useLocalStorage"
import { BREAKPOINT_MD, BREAKPOINT_XS } from "../../config"
import Clear from "../../images/Clear"

const Container = styled.section`
background-color: var(--grey);
color: var(--second);
padding: 2rem;
font-size: 1.5rem;
font-family: var(--font-light);
display: flex;
gap: 2rem;
justify-content: space-between;
@media(max-width: ${BREAKPOINT_MD}px) { 
    flex-direction: column;
}
@media(max-width: ${BREAKPOINT_XS}px) { 
    padding: 1rem;
}
.controls {
    white-space: nowrap;
    display: flex;
    gap: 2rem;
    align-items: center;
    @media(max-width: ${BREAKPOINT_MD}px) { 
        white-space: wrap;
        line-height: 3rem;
    }
    @media(max-width: ${BREAKPOINT_XS}px) { 
        justify-content: space-between;
    }
}
button {
    line-height: 2rem;
    word-break: keep-all;
    white-space: nowrap;
    padding: 0 1rem;
    cursor: pointer;
    box-sizing: border-box;
    text-transform: uppercase;
    &.primary {
        background-color: var(--second);
        color: var(--background);
        border: 1px solid var(--second);
        @media(max-width: ${BREAKPOINT_XS}px) { 
            flex: 1;
            text-align: center;
        }
    }
    &.secondary {
        background-color: transparent;
        color: var(--second);
        border-color: var(--second);
        border: 1px solid var(--second);
        @media(max-width: ${BREAKPOINT_XS}px) { 
            flex: 1;
            text-align: center;
        }
    }
    &.clear {
        padding: 0;
        display: flex;
        align-items: center;
    }
}

`

const DonationBar = () => {
    const [visible, setVisible] = useState(true);
    const navigate = useNavigate();
    const [hidden, setHidden] = useLocalStorage("donationBarHidden", "false");

    const goToLink = () => {
        setVisible(false)
        navigate("/page/donate")
    }
    useEffect(() => {
        if (!visible && !hidden)
            setHidden("true");
    }, [hidden, setHidden, visible])
    if (!visible || hidden === "true") return <></>
    return (
        <FadeIn>
            <Container>
                <div className="text">
                    Do you want to support res.radio?
                </div>
                <div className="controls">
                    <button className="primary" onClick={() => goToLink()}>Donate</button>
                    <button className="secondary" onClick={() => { setVisible(false) }}>No thanks</button>
                    <button className="clear" onClick={() => setVisible(false)}><Clear /></button>
                </div>
            </Container>
        </FadeIn>
    )
}

export default DonationBar;