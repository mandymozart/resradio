import styled from "@emotion/styled"
import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import useThemeStore from "../../Stores/ThemeStore"
import ClearSmall from "../../images/ClearSmall"
import Search from "../../images/Search"

const Container = styled.div`
  svg {
    height: 2rem;
    width: 2rem;;
  }
form {  
    height: 5.5rem;
    
    background-color: var(--grey);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    .input {
        flex: 50% 0 0;
        display: flex;
    justify-content: space-between;
    align-items: center;
    }
    input {
        font-size: 1.5rem;
        font-family: var(--font-light);
        width: 100%;
        border: 1px solid var(--color);
    }
    svg {
        width: 1rem;
        height: 1rem;
    }
    button.submit {
        margin-right: 3rem;
    }
}
`
const SearchBar = () => {
    const { searchbarIsVisible, setSearchbarIsVisible } = useThemeStore();
    const [value, setValue] = useState("")
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        navigate({
            pathname: '/search',
            search: '?q=' + value,
        });
    }
    if (!searchbarIsVisible) return <></>
    return (
        <Container>
            <form onSubmit={handleSubmit}>
                <div className="input">
                    <input name="q" type="text"
                        autoFocus
                        value={value}
                        className="search-input"
                        placeholder="SEARCH"
                        onChange={(e) => setValue(e.target.value)}
                    />
                    <button className="submit" type="submit" onClick={handleSubmit}><Search /></button>
                </div>
                <button className="clear" onClick={() => setSearchbarIsVisible(false)}><ClearSmall /></button>
            </form>
        </Container>
    )
}

export default SearchBar;