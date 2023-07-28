import styled from '@emotion/styled';
import React, { Component } from 'react';
import PrimaryButton from '../FormElements/PrimaryButton';

const Container = styled.div`
margin: 0 auto;
max-width: 25rem;
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
    }
}
`


class ChatLogin extends Component {
    constructor(props) {
        super(props);

        this.handleUsername = this.handleUsername.bind(this);
        this.login = this.login.bind(this);

        this.state = {
            username: '',
        };
    }

    handleUsername(e) {
        this.setState({
            username: e.target.value,
        });
    }

    login = () => {
        if (!this.state.username) {
            return
        };
        const updated_state = {
            activate: true,
            username: this.state.username

        };
        this.props.changeState(updated_state);
    }


    render() {
        return (
            <Container>
                <p>Please follow the community guidelines and treat any being with respect!</p>
                <form onSubmit={this.handleUsername}>
                    <input
                        placeholder="Name"
                        id="username-input"
                        onChange={this.handleUsername}
                    />
                    <PrimaryButton className="submit" onClick={this.login}>Login</PrimaryButton>
                </form>
            </Container>
        )


    }
}
export default ChatLogin;