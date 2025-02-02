import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../utils/api';
import './css/Login.css';
const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(username, password);
            onLogin(); // Update login state
            navigate('/home');
        }
        catch (err) {
            setError('Invalid username or password');
        }
    };
    return (_jsx("div", { className: "login-container", children: _jsxs("div", { className: "login-box", children: [_jsx("h2", { children: "Login" }), error && _jsx("p", { className: "error-message", children: error }), _jsxs("form", { onSubmit: handleSubmit, children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Username" }), _jsx("input", { type: "text", value: username, onChange: (e) => setUsername(e.target.value), required: true })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Password" }), _jsx("input", { type: "password", value: password, onChange: (e) => setPassword(e.target.value), required: true })] }), _jsx("button", { type: "submit", className: "submit-button", children: "Login" })] }), _jsxs("p", { className: "register-link", children: ["Don't have an account? ", _jsx("a", { href: "/register", children: "Register here" }), "."] })] }) }));
};
export default Login;
