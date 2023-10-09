import styled from "@emotion/styled";
import Avatar from "boring-avatars";
import clsx from "clsx";
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime";
import React from "react";
dayjs.extend(relativeTime);

const Container = styled.div`
font-size: 1rem;
margin: 1rem 0 0 0;
padding: 1rem;
background: var(--grey);
border-radius: 0.5rem;
.username {
    font-family: var(--font-medium);
    white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: block;
}
&.isSelf {
    background-color: var(--second);
    color: var(--background);
}
&.isSystemMessage {
    background-color: transparent;
    text-align: center;
    color: var(--color);
    .header {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 0.5rem;
    }
    .body {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 0.5rem;
    }
    .username {
        font-family: var(--font-light);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: block;
    }
    .time {
        font-size: 1rem;
    }
}
.time {
    text-align: right;
    font-size: .75rem;
}
.row {
    display: flex;
    gap: .5rem;
    align-items: center;
}
`

const Message = ({ message, username }) => {
    return (
        <Container className={clsx({ isSelf: message.username === username, isSystemMessage: message.action })}>
            <div className="header">
                <div className="row">
                    <div className="avatar">
                        <Avatar
                            size={32}
                            name={message.username}
                            variant="beam"
                            colors={["#fafafa", "#0d0d0d", "#38ff6a", "#9c9c9c", "#4b31f2"]}
                        />
                    </div>
                    <div className="username">
                        {message.username}
                    </div>
                </div>
            </div>
            <div className="body">
                <div className="message">
                    {message.body}
                </div>
                <div className="time">
                    <small>{dayjs(message.created_at).fromNow()}</small>
                </div>
            </div>
        </Container>
    )
}

export default Message;