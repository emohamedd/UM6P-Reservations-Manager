import React from 'react';
import './SplashScreen.css'; // Import the styles for the splash screen

const SplashScreen = () => {
  return (
    <div className="splash-container">
      <div className="logo-animation">
        <img src='./assets/um6p.svg' alt="Logo" className='logo'/>
        <span className="separator">X</span>
        <img src="./assets/ocp.svg" alt="Logo"  className='logo2'/>
      </div>
    </div>
  );
};

export default SplashScreen;
