import styled from "@emotion/styled"
import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import ClearSmall from "../../images/ClearSmall"
import Search from "../../images/Search"

const Container = styled.div`
form {
    position: absolute;
    left: 75vw;
    top: 0;
    width: 25vw;
    height: 5.5rem;
    z-index: 100;
    
    background-color: var(--background);
    display: flex;
    justify-content: space-between;
    align-items: center;
    input {
        font-size: 1.5rem;
        font-family: var(--font-light);
        width: 50vw;
    }
    svg {
        width: 2rem;
        height: 2rem;
    }
    button.submit {
        margin-right: 3rem;
    }
}
`

const SearchButton = styled.button`
`

const SearchBar = () => {
    const [visible, setVisible] = useState();
    const [value, setValue] = useState("")
    const navigate = useNavigate();

    const handleSubmit = () => {
        navigate({
            pathname: '/search',
            search: '?q=' + value,
        });
    }
    const toggle = () => {
        setVisible(!visible);
    }
    return (
        <Container>
            {visible && (
                <form onSubmit={handleSubmit}>
                    <input name="q" type="text"
                        value={value}
                        className="search-input"
                        placeholder="Search ..."
                        onChange={(e) => setValue(e.target.value)}
                    />
                    <button className="clear" onClick={() => toggle()}><ClearSmall /></button>
                    <button className="submit" type="submit" onClick={handleSubmit}><Search /></button>
                </form>
            )}
            <button className="toggle" onClick={() => toggle()}><Search /></button>
        </Container>
    )
}

export default SearchBar;