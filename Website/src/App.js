import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Chatbot from './components/Chatbot';
import './components/css/Navbar.css';
const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const handleLogin = () => {
        setIsLoggedIn(true);
    };
    const handleLogout = () => {
        localStorage.removeItem('access_token');
        setIsLoggedIn(false);
    };
    return (_jsx(Router, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/login", element: _jsx(Login, { onLogin: handleLogin }) }), _jsx(Route, { path: "/register", element: _jsx(Register, {}) }), _jsx(Route, { path: "/home", element: _jsx(Home, {}) }), _jsx(Route, { path: "/chatbot", element: _jsx(Chatbot, {}) }), _jsx(Route, { path: "/", element: _jsx(Login, { onLogin: handleLogin }) })] }) }));
};
export default App;
