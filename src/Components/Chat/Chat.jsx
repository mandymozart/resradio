import { useChannel, usePresence } from '@ably-labs/react-hooks';
import React, { useState } from 'react';
import config from '../../config';
import Button from '../Button';
import Message from './Message';


const Chat = ({ username }) => {


    const [body, setBody] = useState('');
    const [items, setItems] = useState([]);
    const [channel] = useChannel(config.ABLY_CHAT_CHANNEL, (msg) => {
        const prevState = [...items]
        console.log(msg, prevState, items, [...prevState, msg.data])
        setItems([...prevState, msg.data]);
    });

    usePresence(config.ABLY_CHAT_CHANNEL, { username: username, role: "chatter" }, (update) => {
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
        <div>
            <form className="form" onSubmit={handleMessageSubmit}>
                <input
                    id="new-message"
                    onChange={handleMessageChange}
                    value={body}
                    placeholder='Message'
                />
                <Button>Send</Button>
            </form>

            <div className='list'>
                {items?.map(item => (
                    <div key={item.created_at + item.username} className="message-item">
                        <Message message={item} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Chat;