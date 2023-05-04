import React, { useEffect, useRef, useState } from 'react';
import { useIdentityContext } from 'react-netlify-identity';
import { redirect } from 'react-router-dom';

import {
    AuthOption,
    AuthText,
    Button,
    ButtonGoogle,
    Container,
    Form,
    Header,
    Input,
    Label,
    TextError,
} from './components';

export const LogI = () => {
    const { loginUser } = useIdentityContext();
    const [error, setError] = useState(false);
    const emailInput = useRef(null);
    const passwordInput = useRef > (null);
    const logInButton = useRef(null);

    useEffect(() => {
        logInButton.current.disabled = true;
    }, [emailInput, passwordInput]);

    const handleChange = () => {
        const email = emailInput.current.value;
        const password = passwordInput.current.value;
        if (email && password) {
            logInButton.current.disabled = false;
        } else {
            logInButton.current.disabled = true;
        }
    };

    const logIn = (event) => {
        event.preventDefault();
        const email = emailInput.current.value;
        const password = passwordInput.current.value;
        loginUser(email, password, true)
            .then(() => {
                redirect("/studio");
            })
            .catch((error) => {
                setError(true);
                console.log(error);
            });
    };

    return (
        <>
            <Header name={'Log in'} />
            <Container>
                <AuthOption>
                    <AuthText>Log in with email:</AuthText>
                    <Form narrow onSubmit={logIn}>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            type="email"
                            id="email"
                            ref={emailInput}
                            onChange={handleChange}
                        />
                        <Label htmlFor="password">Password</Label>
                        <Input
                            type="password"
                            id="password"
                            ref={passwordInput}
                            onChange={handleChange}
                        />
                        {error ? (
                            <TextError>
                                The email and/or password seems to be incorrect. Please check it
                                and try again.
                            </TextError>
                        ) : null}
                        <Button type="submit" ref={logInButton}>
                            Log in
                        </Button>
                    </Form>
                </AuthOption>
                <AuthOption>
                    <AuthText>Or log in with Google:</AuthText>
                    <ButtonGoogle>Log in with Google</ButtonGoogle>
                </AuthOption>
            </Container>
        </>
    );
};