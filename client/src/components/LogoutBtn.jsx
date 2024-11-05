import React from "react";
import Cookies from "js-cookie";
import "./LogoutBtn.css";
import SplashScreen from "./SplashScreen";
import Auth from "./Auth";
const LogoutBtn = () => {
 

    const handleLogout = () => {
        Cookies.remove('isLoggedIn'); 
        window.location.reload(); 
      };
      return (
        <div className="logout-container">
          <button id="logout-btn" onClick={handleLogout}>
            Logout
          </button>
          
        </div>
      );

};
export default LogoutBtn;