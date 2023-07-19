import styled from '@emotion/styled';
import React, { Component } from 'react';
import { BREAKPOINT_XS } from '../../config';
import Chat from './Chat';
import ChatLogin from './ChatLogin';


const Container = styled.div`
    padding: 2rem;
    @media (max-width: ${BREAKPOINT_XS}px) {
        padding: 1rem;
    }
`

class ChatBox extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            activate: false,
        };
    }

    changeState = (state) => {
        this.setState(state);
    }

    render() {
        return (
            <Container>
                <h3>Chat</h3>
                {!this.state.activate ? (
                    <ChatLogin changeState={this.changeState} />
                ) : (
                    <Chat username={this.state.username} />
                )}
            </Container>
        );
    }
}

export default ChatBox;