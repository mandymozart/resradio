import styled from '@emotion/styled';
import React from 'react';
import useChatStore from '../../Stores/ChatStore';
import { BREAKPOINT_XS } from '../../config';
import PrimaryButton from '../FormElements/PrimaryButton';

const Container = styled.div`
    padding: 2rem;
    height: calc(100vh - 20rem);
    @media (max-width: ${BREAKPOINT_XS}px) {
        padding: 1rem;
        height: calc(100vh - 16rem);
    }
    margin: 0 auto;
    max-width: 25rem;
    p {
        font-size: 1rem;;
    }
    form {
    padding: 1rem;
    background-color: var(--grey);
    input {
        text-align: center;
        padding: 0;
        margin: 0;
        box-sizing: border-box;
        margin-bottom: 1rem;
        font-size: 1rem;
        font-family: var(--font-light);
        width: 100%;
        border: 1px solid var(--color);
    }
    .submit {
        width: 100%;
        text-align: center;
    }
}
`
const ChatLogin = () => {
    const { username, setUsername, setActivate } = useChatStore()

    const handleUsername = (e) => {
        e.preventDefault();
        setUsername(e.target.value);
    }

    const login = () => {
        if (username.length > 0)
            setActivate(true)
    }
    return (
        <Container>
            <p>Please follow the community guidelines and treat any being with respect!</p>
            <form onSubmit={handleUsername}>
                <input
                    placeholder="Name"
                    id="username-input"
                    onChange={handleUsername}
                    value={username}
                />
                <PrimaryButton className="submit" onClick={login}>Login</PrimaryButton>
            </form>
        </Container>
    )
}

export default ChatLogin;