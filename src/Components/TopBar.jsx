import styled from "@emotion/styled";
import React, { useRef, useState } from "react";
import { useOnClickOutside } from "usehooks-ts";
import AudioPlayer from "./AudioPlayer/AudioPlayer";
import SlideOut from "./SlideOut";

const Container = styled.div`
  box-sizing: border-box;
  min-height: calc(3rem + 2px);
`


const TopBar = () => {
    const ref = useRef(null);
    const [isExpanded, setIsExpanded] = useState(false);

    const handleClickOutside = () => {
        if (isExpanded)
            setIsExpanded(false);
    }

    useOnClickOutside(ref, handleClickOutside)
    return (
        <Container ref={ref}>
            <AudioPlayer isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
            <SlideOut isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
        </Container>
    )
}

export default TopBar;