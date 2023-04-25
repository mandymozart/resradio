import styled from "@emotion/styled"
import React, { useEffect, useState } from "react"
import { DebounceInput } from "react-debounce-input"
import { createSearchParams, useSearchParams } from "react-router-dom"
import Search from "../../images/Search"
import { HeaderButton } from "../Header"

const Container = styled.div`

`

const SearchButton = styled.button`
`

const SearchBar = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [value, setValue] = useState("")
    useEffect(() => {
        setValue(searchParams.get("q"))
    }, [searchParams, setValue])
    return (
        <Container>
            <DebounceInput name="q" type="search"
                minLength={3}
                debounceTimeout={300}
                className="search-input"
                placeholder="Search ..."
                value={value}
                onChange={(event) => {
                    setSearchParams(
                        createSearchParams({ q: event.target.value })
                    );
                }} />
            <HeaderButton><Search /></HeaderButton>
        </Container>
    )
}

export default SearchBar;