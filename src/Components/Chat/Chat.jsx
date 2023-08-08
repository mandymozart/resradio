import { useChannel, usePresence } from '@ably-labs/react-hooks';
import styled from '@emotion/styled';
import React, { useState } from 'react';
import { GoPaperAirplane } from 'react-icons/go';
import { ABLY_CHAT_CHANNEL } from '../../config';
import PrimaryButtonSquare from '../FormElements/PrimaryButtonSquare';
import Message from './Message';

const Container = styled.div`
font-size: 1rem;
font-family: var(--font-light);
width: 100%;
padding-top: 1rem;
form {
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
`

const Chat = ({ username }) => {
    const [body, setBody] = useState('');
    const [items, setItems] = useState([]);
    const [channel] = useChannel(ABLY_CHAT_CHANNEL, (msg) => {
        const prevState = [...items]
        console.log(msg, prevState, items, [...prevState, msg.data])
        setItems([...prevState, msg.data]);
    });

    usePresence(ABLY_CHAT_CHANNEL, { username: username, role: "chatter" }, (update) => {
        console.log(update)
        const prevState = [...items]
        if (update.action === "enter")
            setItems([...prevState, { 'username': update.data.username, 'body': 'entered', created_at: new Date() }]);
        if (update.action === "leave")
            setItems([...prevState, { 'username': update.data.username, 'body': 'left', created_at: new Date() }]);
    });

    const handleMessageChange = (e) => {
        setBody(e.target.value);
    }

    const handleMessageSubmit = (e) => {
        e.preventDefault();
        if (!body.length) {
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
        <Container>
            <form className="form" onSubmit={handleMessageSubmit}>
                <input
                    id="new-message"
                    onChange={handleMessageChange}
                    value={body}
                    placeholder='Message'
                />
                <PrimaryButtonSquare><GoPaperAirplane /></PrimaryButtonSquare>
            </form>

            <div className='list'>
                {items?.map(item => (
                    <div key={item.created_at + item.username} className="message-item">
                        <Message message={item} username={username} />
                    </div>
                ))}
            </div>
        </Container>
    );
}

export default Chat;