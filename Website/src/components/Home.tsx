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
  return (
    <div className="home-container">
        <div className="home-header">
            <div className='home-header-text'>
                <h1 className='home-header-title'>A Common Platform For Personalized Healthcare Information</h1>
                
                <p className='home-header-text'>Robust and well-developed technology interlinking experienced doctors, trusted clinics, certified pharmacies, labs and patients to ease the process of healthcare.</p>
            </div>
            <div className='home-header-image'>
                <img src="./image/" alt="" />
            </div>
        </div>
        <div className="home-content">
            <div className='home-content-image'>

            </div>
            <div className='home-content-text'> 
                <h1>Introducing AI Healthcare</h1>
                <h2>A Cloud-based Healthcare Platform</h2>
                <p>SmartCare is developed to digitalize and simplify the task of integrating 
                    everything related to Healthcare, including medical, clinical & pharmaceutical 
                    procurement and maintenance of records. It is founded by the Sweden based company 
                    SmartCareAnalytica AB, a Healthcare Information Technology company committed to 
                    providing innovative solutions with knowledge-enabled tools that empower healthcare
                     professionals to manage, track and automate their operational, administrative and 
                     financial processes. SmartCare is the business application to run every aspect of a clinic.</p>


            </div>
        </div>

        <div className="home-principle">
            <div className="home-principle-div">
            <div>
                <div className='home-principle-div1'></div>
            </div>
                <h2>Vision</h2>
                <p>
                Our vision is to provide the best technologies to healthcare 
                clinics and help society to improve their quality of life. We trust 
                that it can be achieved by offering innovative, cost-effective and 
                user-friendly products and services. We believe that our products will 
                build mutually beneficial relationships between healthcare professionals and the patients.
                </p>
            </div>
            <div className='home-principle-div'>
            <div>
            <div className='home-principle-div2'></div>

            </div>
                <h2>Mission</h2>
                <p>
                Our mission is to grow our business by using innovation, creativity and the best skills to improve patient health by constantly enhancing the quality of our products and services. We thrive for operational excellence by using our innovative products and being effective in everything we do.
                </p>
            </div>

            <div className='home-principle-div'>
                <div>
                <div className='home-principle-div3'></div>

                </div>
                <h2>Philosophy</h2>
                <p>
                We believe in delivering effective and accurate healthcare with a commitment to offering innovative and creative products and customer service to meet the requirements of each of our customer’s individual needs.
                </p>
            </div>

        </div>
        <div className='divider'>
            <center>
            <p>
            Making Healthcare Easily Accessible For You
            </p>
            </center>
        </div>
        <div className="home-divider">
            <div className="home-divider-div">
            
                <h2>SARAN</h2>
                <h3>Founder</h3>

                <p>
                SARAN is an enthusiastic, confident, and multi-skilled professional with all-round 
                functional and technical expertise from large IT program, having worked for less 
                than 1 years with AWS and Software devlopment.
                </p>
            </div>
            <div className='home-divider-div'>
            
                <h2>MANOJ KUMAR</h2>
                <h3>Co-founder</h3>

                <p>
                Manoj is an enusiastic, confident, and multi-skilled professional with all-round 
                functional and technical expertise from large IT program, having worked for less 
                than 1 years with AWS and Software devlopment.
                </p>
            </div>

            <div className='home-divider-div'>
                
                <h2>BALAJI</h2>
                <h3>Co-founder</h3>

                <p>
                Balaji is an enthusiastic, confident, and multi-skilled professional with all-round 
                functional and technical expertise from large IT program, having worked for less 
                than 1 years with AWS and Software devlopment.
                </p>
            </div>

        </div>
        <div className="chat-button-wrapper">
      <div className="chat-button-ripple"></div>
      <button 
        className={`chat-button ${isHovered ? 'hovered' : ''}`}
        onClick={handleChatClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label="Open Chat"
      >
        <div className="chat-button-inner">
          <div className="chat-icon"></div>
          <span className="chat-tooltip">Let's Chat!</span>
        </div>
        <div className="chat-button-glow"></div>
      </button>
    </div>
    </div>
  );
};

export default Home;
