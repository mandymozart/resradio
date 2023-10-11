import { useChannel, usePresence } from '@ably-labs/react-hooks';
import styled from '@emotion/styled';
import clsx from 'clsx';
import React, { useEffect, useRef, useState } from 'react';
import { GoPaperAirplane } from 'react-icons/go';
import useBroadcastStore from '../../Stores/BroadcastStore';
import useChatStore from '../../Stores/ChatStore';
import { ABLY_CHAT_CHANNEL, BREAKPOINT_XS } from '../../config';
import PrimaryButtonSquare from '../FormElements/PrimaryButtonSquare';
import Message from './Message';

const Container = styled.div`
font-size: 1rem;
font-family: var(--font-light);
width: 100%;
form {
    padding: 2rem;
    @media (max-width: ${BREAKPOINT_XS}px) {
        padding: 1rem;
    }
    background: var(--grey);
    display: flex;
    input {
        flex: 1;
        margin-right: 1rem;
        padding: 0 0.5rem;
        line-height: 2rem;
        border-radius: 0.1rem;
        border: 1px solid var(--color);
        font-size: 1rem;
        font-family: var(--font-light)
    }
}

.list {
    overflow: auto;
    transition: transform .2s ease-out;
    padding: 2rem;
    height: calc(100vh - 26.5rem);
    @media (max-width: ${BREAKPOINT_XS}px) {
        padding: 1rem;
    }
}
&.isBroadcastVisible .list {
    height: calc(100vh - 35.5rem);
    @media (max-width: ${BREAKPOINT_XS}px) {
        height: calc(100vh - 29.5rem);
    }
}
`

const Chat = ({ setChatterCount }) => {
    const { username } = useChatStore();
    const { isVisible: isBroadcastVisible } = useBroadcastStore();
    const [body, setBody] = useState('');
    const [items, setItems] = useState([]);

    const messageEl = useRef(null);

    useEffect(() => {
        if (messageEl) {
            messageEl.current.addEventListener('DOMNodeInserted', event => {
                const { currentTarget: target } = event;
                target.scroll({ top: target.scrollHeight, behavior: 'smooth' });
            });
        }
    }, [])

    const [channel] = useChannel(`[?rewind=100]${ABLY_CHAT_CHANNEL}`, (update) => {
        const newItem = { id: update.id, username: update.data.username, body: update.data.body, created_at: update.data.created_at, action: update.action }
        setItems((prevState) => [...prevState, newItem]);
    });

    const [presenceData] = usePresence(ABLY_CHAT_CHANNEL, { username: username, role: "chatter" }, (update) => {
        if (update.action === "enter") {
            setItems((prevState) => [...prevState, { id: update.id, 'username': update.data.username, 'body': 'entered', created_at: new Date(), action: update.action }]);
            return
        }
        if (update.action === "leave") {
            setItems((prevState) => [...prevState, { id: update.id, 'username': update.data.username, 'body': 'left', created_at: new Date(), action: update.action }]);
            return
        }
    });
    useEffect(() => {
        setChatterCount(presenceData.filter(m => m.data !== "chatter").length)
    }, [presenceData])


    const handleMessageChange = (e) => {
        setBody(e.target.value);
    }

    const handleMessageSubmit = (e) => {
        e.preventDefault();
        if (body.length < 1) {
            return;
        }
        const newItem = {
            username: username,
            body: body,
            created_at: new Date(),
        };
        channel.publish('message', newItem);

        setBody('');
    }
    return (
        <Container className={clsx({ isBroadcastVisible: isBroadcastVisible })}>
            <div className='list' ref={messageEl}>
                {items?.map(item => (
                    <div key={item.id} className="message-item">
                        <Message message={item} username={username} />
                    </div>
                ))}
            </div>
            <form className="form" onSubmit={handleMessageSubmit}>
                <input
                    id="new-message"
                    onChange={handleMessageChange}
                    value={body}
                    placeholder='Message'
                />
                <PrimaryButtonSquare><GoPaperAirplane /></PrimaryButtonSquare>
            </form>
        </Container>
    );
}

export default Chat;