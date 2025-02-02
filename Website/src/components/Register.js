import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../utils/api';
import './css/Register.css';
const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(username, email, password, phoneNumber);
            navigate('/login');
        }
        catch (err) {
            setError('Registration failed');
        }
    };
    return (_jsx("div", { className: "register-container", children: _jsxs("div", { className: "register-box", children: [_jsx("h2", { children: "Register" }), error && _jsx("p", { className: "error-message", children: error }), _jsxs("form", { onSubmit: handleSubmit, children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Username" }), _jsx("input", { type: "text", value: username, onChange: (e) => setUsername(e.target.value), required: true })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Email" }), _jsx("input", { type: "email", value: email, onChange: (e) => setEmail(e.target.value), required: true })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Password" }), _jsx("input", { type: "password", value: password, onChange: (e) => setPassword(e.target.value), required: true })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Phone Number" }), _jsx("input", { type: "text", value: phoneNumber, onChange: (e) => setPhoneNumber(e.target.value) })] }), _jsx("button", { type: "submit", className: "submit-button", children: "Register" })] }), _jsxs("p", { className: "login-link", children: ["Already have an account? ", _jsx("a", { href: "/login", children: "Login here" }), "."] })] }) }));
};
export default Register;
