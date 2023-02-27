import styled from "@emotion/styled"
import { FilterForm } from "./FilterForm";
import { useState } from "react";

const Container = styled.div`
img {width: 4rem;}`;

export const FilterInfo = () => {
    const [isVisible, setIsVisble] = useState(true);
    return (
        <Container>
            {!isVisible ? (<>
                <img src={"https://placehold.it/400x400"} alt="Untitled" />
                Show: Untitled<br />
                Host: Unknown - Link<br />
            </>) : (
                <FilterForm />
            )}
            <SettingsButton onClick={() => setIsVisble(!isVisible)} />
        </Container>
    )
}

const StyledButton = styled.button``

const SettingsButton = () => {
    return (
        <StyledButton>
            Settings
        </StyledButton>
    )
}