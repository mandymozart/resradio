import styled from "@emotion/styled";
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime";
import React from "react";
dayjs.extend(relativeTime);

const Container = styled.div`
font-size: 1rem;
margin: 1rem 0 0 0;
padding: 1rem;
background: var(--grey);
border-radius: 0.5rem;`

const Message = ({ message }) => {
    return (
        <Container>
            <div className="header">
                <div className="row">
                    <div className="username">
                        <b>{message.username}:</b>
                    </div>
                    <div className="time">
                        <small>{dayjs(message.created_at).fromNow()}</small>
                    </div>
                </div>
            </div>
            <div className="body">
                {message.body}
            </div>
        </Container>
    )
}

export default Message;