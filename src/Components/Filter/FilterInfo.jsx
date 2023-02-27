import styled from "@emotion/styled"

const Container = styled.div``;

export const FilterInfo = () => {
    return (
        <Container>
            <img src={"https://placehold.it/400x400"} alt="Untitled" />
            Show: Untitled<br/>
            Host: Unknown - Link<br />
            <SettingsButton />
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