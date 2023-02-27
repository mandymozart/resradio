import styled from "@emotion/styled"
import { FilterForm } from "./FilterForm";
import { useState } from "react";

const Container = styled.div`
img {width: 4rem;}`;

export const FilterInfo = () => {
    const [isVisible, setIsVisble] = useState();
    return (
        <Container>
            <SettingsButton onClick={() => setIsVisble(!isVisible)} />
            {!isVisible ? (<>
                <img src={"https://placehold.it/400x400"} alt="Untitled" />
                Show: Untitled<br />
                Host: Unknown - Link<br />
            </>) : (
                <FilterForm />
            )}
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