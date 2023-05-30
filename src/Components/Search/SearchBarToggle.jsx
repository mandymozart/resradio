import styled from "@emotion/styled";
import React from "react";
import useThemeStore from "../../Stores/ThemeStore";
import Search from "../../images/Search";

const Container = styled.button`
    cursor: pointer;
`;

const SearchBarToggle = () => {
    const { searchbarIsVisible, setSearchbarIsVisible } = useThemeStore();
    const toggle = () => {
        setSearchbarIsVisible(!searchbarIsVisible);
    }
    return (
        <Container className="toggle" onClick={() => toggle()}><Search /></Container>
    )
}

export default SearchBarToggle;