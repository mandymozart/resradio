import styled from '@emotion/styled';
import React, { useEffect } from 'react';
import { GoSignOut, GoTools } from 'react-icons/go';
import { useNetlifyIdentity } from 'react-netlify-identity';
import useChatStore from '../../Stores/ChatStore';
import { BREAKPOINT_XS } from '../../config';
import Button from '../Button';
import Chat from './Chat';
import ChatLogin from './ChatLogin';


const Container = styled.div`
h2 {
    display: flex;
    justify-content: space-between;
    padding: 2rem;
    @media (max-width: ${BREAKPOINT_XS}px) {
        padding: 1rem;
    }
}

`

const ChatBox = () => {
    const { user, isLoggedIn } = useNetlifyIdentity()
    const { setUsername, activate, setActivate } = useChatStore()
    // Automatically sign in logged in netlify identity users
    useEffect(() => {
        if (user && isLoggedIn) {
            setUsername(user.email);
        }
    }, [user, isLoggedIn, setUsername])
    return (
        <Container>
            <h2>Chat
                <div className='controls'>
                    <Button ghost hasIcon onClick={() => setActivate(false)}><GoTools /></Button>
                    <Button ghost hasIcon onClick={() => setActivate(false)}><GoSignOut /></Button>
                </div>
            </h2>
            {activate ? (
                <Chat />
            ) : (
                <ChatLogin />
            )}
        </Container>
    )
}

export default ChatBox;