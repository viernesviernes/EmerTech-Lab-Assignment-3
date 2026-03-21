import { useState } from 'react';
import { gql, useMutation } from '@apollo/client';

const LOGIN_BY_EMAIL_MUTATION = gql`
    mutation LoginByEmail($email: String!, $password: String!) {
        loginByEmail(email: $email, password: $password) {
            id
            username
            email
            role
        }
    }
`;

const LOGIN_BY_USERNAME_MUTATION = gql`
    mutation LoginByUsername($username: String!, $password: String!) {
        loginByUsername(username: $username, password: $password) {
            id
            username
            email
            role
        }
    }
`;

const Login = () => {
    const [input, setInput] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const onCompleted = (data) => {
        const user = data?.loginByEmail || data?.loginByUsername;
        if (!user?.id) {
            setError("Invalid credentials. Please try again.");
            return;
        }
        window.dispatchEvent(new CustomEvent('loginSuccess', { detail: { isLoggedIn: true } }));
        window.location.href = '/';
    };

    const onError = (err) => {
        setError(err.message);
    };

    const [loginByEmail] = useMutation(LOGIN_BY_EMAIL_MUTATION, { onCompleted, onError });
    const [loginByUsername] = useMutation(LOGIN_BY_USERNAME_MUTATION, { onCompleted, onError });

    const handleSubmit = (e) => {
        e.preventDefault();
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (emailRegex.test(input)) {
            loginByEmail({ variables: { email: input, password } });
        } else {
            loginByUsername({ variables: { username: input, password } });
        }
    };

    return (
        <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <label>Username or Email</label>
                <input
                    type="text"
                    placeholder="Enter username or email"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label>Password</label>
                <input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            {error && <p className="auth-error">{error}</p>}
            <button className="auth-submit-btn" type="submit">Log In</button>
        </form>
    );
};

export default Login;
