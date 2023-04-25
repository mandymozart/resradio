import styled from "@emotion/styled";
import React from "react";
import Apply from "../../images/Apply";
import cherry from "../../images/cherry.png";
import Announcement from "./Announcement";

const Container = styled.section`
    display: grid;
    grid-template-columns: 2fr 1fr 1fr;
    gap: 2rem;
    align-items: center;
    justify-content: center;

`

const Cherry = () => {
    return (
        <img src={cherry} />
    )
}

const Bulletin = () => {
    return (
        <Container>
            <Announcement />
            <Apply />
            <Cherry />
        </Container>
    )
}

export default Bulletin;