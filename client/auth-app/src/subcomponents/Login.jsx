import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { gql, useMutation } from '@apollo/client';

const Login = () => {

    const [input, setInput] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const LOGIN_BY_EMAIL_MUTATION = gql`
    mutation LoginByEmail($email: String!, $password: String!) {
        loginByEmail(email: $email, password: $password)
    }
    `;

    const LOGIN_BY_USERNAME_MUTATION = gql`
    mutation LoginByUsername($username: String!, $password: String!) {
        loginByUsername(username: $username, password: $password)
    }
    `;

    const onCompleted = (data) => {
        console.log("Login successful!", data);
    };

    const onError = (error) => {
        console.log("Login failed!", error.message);
        setError(error.message);
    };

    const [loginByEmail] = useMutation(LOGIN_BY_EMAIL_MUTATION, { onCompleted, onError });
    const [loginByUsername] = useMutation(LOGIN_BY_USERNAME_MUTATION, { onCompleted, onError });

    const handleSubmit = (event) => {
        event.preventDefault();

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!emailRegex.test(input)) {
            console.log("Logging in by email");
            loginByEmail({ variables: { email: input, password: password } })
        } else {
            console.log("Logging in by username");
            loginByUsername({ variables: { username: input, password: password } })
        }

        console.log(input, password);
    }

    return (
        <>
        <h1>Log In</h1>
        <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Username/Email</Form.Label>
                <Form.Control placeholder="Enter username or email" onChange={(e) => setInput(e.target.value)} required />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
            </Form.Group>
            {
                error &&
                <Form.Group className="mb-3" controlId="formBasicError">
                    <Form.Text className="text-danger">
                        {error}
                    </Form.Text>
                </Form.Group>
            }
            <Button variant="primary" type="submit">
                Log In
            </Button>
        </Form>
        </>
    )
}

export default Login;