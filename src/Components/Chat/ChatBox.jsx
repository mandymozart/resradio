import styled from '@emotion/styled';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { GoGear } from 'react-icons/go';
import { useNetlifyIdentity } from 'react-netlify-identity';
import useBroadcastStore from '../../Stores/BroadcastStore';
import useChatStore from '../../Stores/ChatStore';
import { BREAKPOINT_XS } from '../../config';
import Clear from '../../images/Clear';
import Button from '../Button';
import Chat from './Chat';
import ChatLogin from './ChatLogin';


const Container = styled.div`
position: fixed;
bottom: 0;
top: 10.5rem;
right: 0;
pointer-events: none;
z-index: 1;
&.isBroadcastVisible {
    bottom: 9rem;
}
display: flex;
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
    background-color: var(--light);
    width: 23rem;
    transform: translateX(23rem);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    @media (max-width: ${BREAKPOINT_XS}px) {
        width: 100vw;
        transform: translateX(100vw);
    }
    &.isVisible {
        transform: translateX(0);
    }
}
.chat-header {

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
    const { setUsername, activate, setActivate, isVisible, setIsVisible } = useChatStore();
    const { isVisible: isBroadcastVisible } = useBroadcastStore();
    const [chatterCount, setChatterCount] = useState(0);
    // Automatically sign in logged in netlify identity users
    useEffect(() => {
        if (user && isLoggedIn) {
            setUsername(user.email);
        }
    }, [user, isLoggedIn, setUsername])
    return (
        <Container className={clsx({ isBroadcastVisible: isBroadcastVisible })}>
            <div className={clsx("slideout", { isVisible: isVisible })}>
                <header className='chat-header'>
                    <h2>Chat
                        <div className='controls'>
                            <span>{chatterCount} Online</span>
                            <Button ghost hasIcon onClick={() => setActivate(false)}><GoGear /></Button>
                            <Button ghost hasIcon onClick={() => setIsVisible(false)}><Clear /></Button>
                        </div>
                    </h2>
                </header>
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