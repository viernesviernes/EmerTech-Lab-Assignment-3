import { useState } from 'react';
import { Button, Container } from 'react-bootstrap';

import Login from './subcomponents/Login';
import Register from './subcomponents/Register';

const AuthComponent = () => {

    const [isLogin, setIsLogin] = useState(true);

    return (
        <>
        <Container className="d-flex justify-content-center align-items-center">
            <Button onClick={() => setIsLogin(true)} disabled={isLogin}>Login</Button>
            <Button onClick={() => setIsLogin(false)} disabled={!isLogin}>Register</Button>
        </Container>
        {isLogin ? <Login /> : <Register />}
        </>
    )
}
export default AuthComponent;