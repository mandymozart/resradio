import styled from '@emotion/styled';
import React, { useState } from 'react';
import { useIdentityContext } from 'react-netlify-identity';
import { useNavigate } from 'react-router-dom';
import Button from '../Button';
import { Input } from '../FormElements/Input';
import SystemMessage from '../SystemMessage';


const Container = styled.div`
form {
    display:flex;
    flex-direction: column;
    width: 25%;
    background-color: var(--grey);
    padding: 2rem;
    gap: 1rem;
}
padding: 2rem;
`

const CreateAccount = () => {
    const { loginUser, signupUser } = useIdentityContext();
    const [error, setError] = useState(false);
    const navigate = useNavigate();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    const passwordPattern = /^.{6,}$/;

    const signUp = (event) => {
        event.preventDefault();
        signupUser(email, password, {})
            .then(() => {
                loginUser(email, password, true);
                navigate("/studio");
            })
            .catch((error) => {
                setError(true);
            });
    };

    return (
        <Container>
            <form onSubmit={signUp}>
                <h4>Sign up with email:</h4>
                <label htmlFor="email">Email</label>
                <Input
                    type="email"
                    id="email"
                    onChange={e => setEmail(e.target.value)}
                />
                <label htmlFor="password">
                    Password <span>(min. 6 characters)</span>
                </label>
                <Input
                    type="password"
                    id="password"
                    onChange={e => setPassword(e.target.value)}
                />
                {error ? (
                    <SystemMessage>
                        The email and/or password seems to be incorrect. Please check it
                        and try again.
                    </SystemMessage>
                ) : null}
                <Button type="submit" large>
                    CREATE ACCOUNT
                </Button>
            </form>
        </Container>
    );
};

export default CreateAccount;