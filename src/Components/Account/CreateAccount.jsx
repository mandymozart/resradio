import styled from '@emotion/styled';
import React, { useState } from 'react';
import { useIdentityContext } from 'react-netlify-identity';
import { useNavigate } from 'react-router-dom';
import { Input } from '../FormElements/Input';
import PrimaryButton from '../FormElements/PrimaryButton';
import SystemMessage from '../SystemMessage';


const Container = styled.div`
p{
    background: var(--second);
    color: var(--background);
    padding: 1rem;
    font-size: 1rem;
    margin: 0;
    max-width: 27rem;
}
h4 {
    margin: 0;
    margin-bottom: 1rem;
}
form {
    display:flex;
    flex-direction: column;
    max-width: 25rem;
    background-color: var(--grey);
    padding: 2rem;
    gap: 1rem;
}
label {
    font-size: 1rem;
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
                console.log(error)
                setError(true);
            });
    };

    return (
        <Container>
            <p>We are currently invite only for resradio team members. Please contact us via email resradio.vienna@gmail.com.</p>
            <form onSubmit={signUp}>
                <h4>Sign up with email:</h4>
                <label>Email</label>
                <Input
                    type="email"
                    onChange={e => setEmail(e.target.value)}
                />
                <label>
                    Password <span>(min. 6 characters)</span>
                </label>
                <Input
                    type="password"
                    onChange={e => setPassword(e.target.value)}
                />
                {error ? (
                    <SystemMessage small type={"error"}>
                        The email and/or password seems to be incorrect. Please check it
                        and try again.
                    </SystemMessage>
                ) : null}
                <PrimaryButton type="submit" >
                    CREATE ACCOUNT
                </PrimaryButton>
            </form>
        </Container>
    );
};

export default CreateAccount;