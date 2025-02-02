import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// import React, { useEffect, useState } from 'react';
// import { User } from '../types/types';
// import { getUserDetails } from '../utils/api';
// import './css/Home.css';
// const Home: React.FC = () => {
//     const [user, setUser] = useState<User | null>(null);
//     useEffect(() => {
//         const fetchUserDetails = async () => {
//             try {
//                 const userDetails = await getUserDetails();
//                 setUser(userDetails);
//             } catch (err) {
//                 console.error('Failed to fetch user details');
//             }
//         };
//         fetchUserDetails();
//     }, []);
//     return (
//         <div className="home-container">
//             <div className="home-box">
//                 <h2>Welcome to the Home Page</h2>
//                 {user ? (
//                     <div className="user-details">
//                         <p>Username: {user.username}</p>
//                         <p>Email: {user.email}</p>
//                         <p>Phone Number: {user.phone_number}</p>
//                     </div>
//                 ) : (
//                     <p>Loading user details...</p>
//                 )}
//             </div>
//         </div>
//     );
// };
// export default Home;
import { useState } from 'react';
import './css/Home.css';
const Home = () => {
    const [isHovered, setIsHovered] = useState(false);
    const handleChatClick = () => {
        window.location.href = '/chatbot';
    };
    return (_jsxs("div", { className: "home-container", children: [_jsxs("div", { className: "home-header", children: [_jsxs("div", { className: 'home-header-text', children: [_jsx("h1", { className: 'home-header-title', children: "A Common Platform For Personalized Healthcare Information" }), _jsx("p", { className: 'home-header-text', children: "Robust and well-developed technology interlinking experienced doctors, trusted clinics, certified pharmacies, labs and patients to ease the process of healthcare." })] }), _jsx("div", { className: 'home-header-image', children: _jsx("img", { src: "./image/", alt: "" }) })] }), _jsxs("div", { className: "home-content", children: [_jsx("div", { className: 'home-content-image' }), _jsxs("div", { className: 'home-content-text', children: [_jsx("h1", { children: "Introducing AI Healthcare" }), _jsx("h2", { children: "A Cloud-based Healthcare Platform" }), _jsx("p", { children: "SmartCare is developed to digitalize and simplify the task of integrating everything related to Healthcare, including medical, clinical & pharmaceutical procurement and maintenance of records. It is founded by the Sweden based company SmartCareAnalytica AB, a Healthcare Information Technology company committed to providing innovative solutions with knowledge-enabled tools that empower healthcare professionals to manage, track and automate their operational, administrative and financial processes. SmartCare is the business application to run every aspect of a clinic." })] })] }), _jsxs("div", { className: "home-principle", children: [_jsxs("div", { className: "home-principle-div", children: [_jsx("div", { children: _jsx("div", { className: 'home-principle-div1' }) }), _jsx("h2", { children: "Vision" }), _jsx("p", { children: "Our vision is to provide the best technologies to healthcare clinics and help society to improve their quality of life. We trust that it can be achieved by offering innovative, cost-effective and user-friendly products and services. We believe that our products will build mutually beneficial relationships between healthcare professionals and the patients." })] }), _jsxs("div", { className: 'home-principle-div', children: [_jsx("div", { children: _jsx("div", { className: 'home-principle-div2' }) }), _jsx("h2", { children: "Mission" }), _jsx("p", { children: "Our mission is to grow our business by using innovation, creativity and the best skills to improve patient health by constantly enhancing the quality of our products and services. We thrive for operational excellence by using our innovative products and being effective in everything we do." })] }), _jsxs("div", { className: 'home-principle-div', children: [_jsx("div", { children: _jsx("div", { className: 'home-principle-div3' }) }), _jsx("h2", { children: "Philosophy" }), _jsx("p", { children: "We believe in delivering effective and accurate healthcare with a commitment to offering innovative and creative products and customer service to meet the requirements of each of our customer\u2019s individual needs." })] })] }), _jsx("div", { className: 'divider', children: _jsx("center", { children: _jsx("p", { children: "Making Healthcare Easily Accessible For You" }) }) }), _jsxs("div", { className: "home-divider", children: [_jsxs("div", { className: "home-divider-div", children: [_jsx("h2", { children: "SARAN" }), _jsx("h3", { children: "Founder" }), _jsx("p", { children: "SARAN is an enthusiastic, confident, and multi-skilled professional with all-round functional and technical expertise from large IT program, having worked for less than 1 years with AWS and Software devlopment." })] }), _jsxs("div", { className: 'home-divider-div', children: [_jsx("h2", { children: "MANOJ KUMAR" }), _jsx("h3", { children: "Co-founder" }), _jsx("p", { children: "Manoj is an enusiastic, confident, and multi-skilled professional with all-round functional and technical expertise from large IT program, having worked for less than 1 years with AWS and Software devlopment." })] }), _jsxs("div", { className: 'home-divider-div', children: [_jsx("h2", { children: "BALAJI" }), _jsx("h3", { children: "Co-founder" }), _jsx("p", { children: "Balaji is an enthusiastic, confident, and multi-skilled professional with all-round functional and technical expertise from large IT program, having worked for less than 1 years with AWS and Software devlopment." })] })] }), _jsxs("div", { className: "chat-button-wrapper", children: [_jsx("div", { className: "chat-button-ripple" }), _jsxs("button", { className: `chat-button ${isHovered ? 'hovered' : ''}`, onClick: handleChatClick, onMouseEnter: () => setIsHovered(true), onMouseLeave: () => setIsHovered(false), "aria-label": "Open Chat", children: [_jsxs("div", { className: "chat-button-inner", children: [_jsx("div", { className: "chat-icon" }), _jsx("span", { className: "chat-tooltip", children: "Let's Chat!" })] }), _jsx("div", { className: "chat-button-glow" })] })] })] }));
};
export default Home;
