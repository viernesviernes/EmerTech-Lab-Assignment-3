import React from 'react';
import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { gql, useMutation } from '@apollo/client';

const REGISTER_USER = gql`
    mutation Register($username: String!, $email: String!, $password: String!, $role: String!) {
        register(username: $username, email: $email, password: $password, role: $role) {
            id
            username
            email
            role
        }
    }
`;

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [error, setError] = useState('');

    const [registerUser] = useMutation(REGISTER_USER,
        {
            onCompleted: (data) => {
                alert("Registration successful! Please proceed to login.");
                setError('');
            },
            onError: (error) => {
                setError(error.message + " Please try again with different credentials.");
            }
        }
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await registerUser({
                variables: {
                    username: username,
                    email: email,
                    password: password,
                    role: role
                }
            });
            // Handle successful registration (e.g., redirect to login)
        } catch (error) {
            console.error('Error registering user:', error);
        }
    };

    return (
        <>
        <h1>Register</h1>
        <Form onSubmit={handleSubmit}>
            <Form.Group controlId="username">
                <Form.Label>Username</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
            </Form.Group>

            <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </Form.Group>

            <Form.Group controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </Form.Group>

            <Form.Group controlId="role">
                <Form.Label>Role</Form.Label>
                <Form.Select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                >
                    <option value="" disabled>Select a Role</option>
                    <option value="resident">Resident</option>
                    <option value="business_owner">Business Owner</option>
                    <option value="community_organizer">Community Organizer</option>
                </Form.Select>
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
                Register
            </Button>
        </Form>
        </>
    )
}

export default Register;