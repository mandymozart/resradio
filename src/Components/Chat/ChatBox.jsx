import styled from '@emotion/styled';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { GoGear } from 'react-icons/go';
import { useNetlifyIdentity } from 'react-netlify-identity';
import useChatStore from '../../Stores/ChatStore';
import { BREAKPOINT_XS } from '../../config';
import Clear from '../../images/Clear';
import Button from '../Button';
import Chat from './Chat';
import ChatLogin from './ChatLogin';


const Container = styled.div`
position: fixed;
bottom: 0;
right: 0;
pointer-events: none;
height: calc(100vh - 10.5rem);
.chat-button {
    pointer-events: all;
    padding: 1rem;
    background: var(--color);
    color: var(--background);
    border-radius: 50%;
    position: fixed;
    bottom: 1rem;
    right: 1rem;
}

.slideout {
    pointer-events: all;
    background-color: var(--background);
    width: 23rem;
    transform: translateX(23rem);
    @media (max-width: ${BREAKPOINT_XS}px) {
        width: 100vw;
        transform: translateX(100vw);
    }
    transition: transform ease-in 0.3s;
    &.isVisible {
        transform: translateX(0);
    }
}
h2 {
    display: flex;
    justify-content: space-between;
    font-size: 1.5rem;
    padding: 2rem;
    @media (max-width: ${BREAKPOINT_XS}px) {
        padding: 1rem;
    }
    .controls {
        display: flex;
        align-items: center;
        font-size: 1.5rem;
        button {
            margin-left: 1rem;
            font-size: 1.5rem;
        }
    }
    span {
        font-size: 1rem;
    }
}

`

const ChatBox = () => {
    const { user, isLoggedIn } = useNetlifyIdentity()
    const { setUsername, activate, setActivate, isVisible, setIsVisible } = useChatStore()
    const [chatterCount, setChatterCount] = useState(0);
    // Automatically sign in logged in netlify identity users
    useEffect(() => {
        if (user && isLoggedIn) {
            setUsername(user.email);
        }
    }, [user, isLoggedIn, setUsername])
    return (
        <Container>
            <div className={clsx("slideout", { isVisible: isVisible })}>
                <h2>Chat
                    <div className='controls'>
                        <span>{chatterCount} Online</span>
                        <Button ghost hasIcon onClick={() => setActivate(false)}><GoGear /></Button>
                        <Button ghost hasIcon onClick={() => setIsVisible(false)}><Clear /></Button>
                    </div>
                </h2>
                {activate ? (
                    <Chat setChatterCount={setChatterCount} />
                ) : (
                    <ChatLogin />
                )}
            </div>
        </Container>
    )
}

export default ChatBox;