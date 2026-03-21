import { useState } from 'react';
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

    const [registerUser] = useMutation(REGISTER_USER, {
        onCompleted: () => {
            alert("Registration successful! Please proceed to login.");
            setError('');
        },
        onError: (err) => {
            setError(err.message + " Please try again with different credentials.");
        }
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await registerUser({ variables: { username, email, password, role } });
        } catch (err) {
            console.error('Error registering user:', err);
        }
    };

    return (
        <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <label>Username</label>
                <input
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label>Email</label>
                <input
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
            <div className="form-group">
                <label>Role</label>
                <select value={role} onChange={(e) => setRole(e.target.value)} required>
                    <option value="" disabled>Select a role</option>
                    <option value="resident">Resident</option>
                    <option value="business_owner">Business Owner</option>
                    <option value="community_organizer">Community Organizer</option>
                </select>
            </div>
            {error && <p className="auth-error">{error}</p>}
            <button className="auth-submit-btn" type="submit">Register</button>
        </form>
    );
};

export default Register;
