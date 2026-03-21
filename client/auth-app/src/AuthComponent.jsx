import { useState } from 'react';
import './App.css';

import Login from './subcomponents/Login';
import Register from './subcomponents/Register';

const AuthComponent = () => {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className="auth-card">
            <h1>Welcome</h1>
            <div className="auth-tabs">
                <button
                    className={`auth-tab-btn ${isLogin ? 'active' : ''}`}
                    onClick={() => setIsLogin(true)}
                >
                    Log In
                </button>
                <button
                    className={`auth-tab-btn ${!isLogin ? 'active' : ''}`}
                    onClick={() => setIsLogin(false)}
                >
                    Register
                </button>
            </div>
            {isLogin ? <Login /> : <Register />}
        </div>
    );
};

export default AuthComponent;
