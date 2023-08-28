import styled from '@emotion/styled';
import React, { useState } from 'react';
import { useIdentityContext } from 'react-netlify-identity';
import { useNavigate } from 'react-router-dom';
import { Input } from '../FormElements/Input';
import PrimaryButton from '../FormElements/PrimaryButton';
import SystemMessage from '../SystemMessage';

const Container = styled.div`
h4 {
    margin: 0 0 2rem 0;
}
label {
    font-size: 1rem;
}
form {
    display:flex;
    flex-direction: column;
    max-width: 25rem;

    background-color: var(--grey);
    padding: 2rem;
    gap: 1rem;
}
padding: 2rem;
`


const LogIn = () => {
    const { loginUser } = useIdentityContext();
    const [error, setError] = useState(false);
    const navigate = useNavigate();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    const logIn = async (event) => {
        event.preventDefault();
        loginUser(email, password, true)
            .then(() => {
                navigate("/studio/playlists");
            })
            .catch((error) => {
                setError(true);
            });
        // await fetch(`${FUNCTIONS}/user?`).then((r) => {
        //     if (r.ok) {
        //         //
        //     }
        //     if (!r.ok) {
        //     }
        // });
    };

    return (
        <>
            <Container>
                <form onSubmit={logIn}>
                    <h4>Login required!</h4>
                    <label htmlFor="email">Email</label>
                    <Input
                        type="email"
                        id="email"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <label htmlFor="password">Password</label>
                    <Input
                        type="password"
                        id="password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {error ? (
                        <SystemMessage>
                            The email and/or password seems to be incorrect. Please check it
                            and try again.
                        </SystemMessage>
                    ) : null}
                    <PrimaryButton large type="submit">
                        LOGIN
                    </PrimaryButton>
                </form>
            </Container >
        </>
    );
};

export default LogIn;