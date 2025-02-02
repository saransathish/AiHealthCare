import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link, useNavigate } from 'react-router-dom';
import './css/Navbar.css';
const Navbar = ({ isLoggedIn, onLogout }) => {
    const navigate = useNavigate();
    const handleLogout = () => {
        onLogout();
        navigate('/login');
    };
    return (_jsxs("nav", { className: "navbar", children: [_jsx(Link, { to: "/", className: "navbar-brand", children: "AI HealthCare" }), _jsx("div", { className: "navbar-links" })] }));
};
export default Navbar;
