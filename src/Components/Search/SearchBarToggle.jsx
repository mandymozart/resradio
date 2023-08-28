import styled from "@emotion/styled";
import React from "react";
import { GoSearch } from "react-icons/go";
import useThemeStore from "../../Stores/ThemeStore";

const Container = styled.button`
    cursor: pointer;
`;

const SearchBarToggle = () => {
    const { searchbarIsVisible, setSearchbarIsVisible } = useThemeStore();
    const toggle = () => {
        setSearchbarIsVisible(!searchbarIsVisible);
        if (!searchbarIsVisible) window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    }
    return (
        <Container className="toggle" onClick={() => toggle()}><GoSearch /></Container>
    )
}

export default SearchBarToggle;