import React from "react";
import Cookies from "js-cookie";
import "./LogoutBtn.css";
import Auth from "./Auth";
const LogoutBtn = () => {
 
    const handleLogout = () => {
        Cookies.remove('isLoggedIn'); // Clear the login state from cookies
        window.location.reload(); // Refresh the page to reset the app
      };
    return <button id="logout-btn" onClick={handleLogout}>Logout</button>;}

export default LogoutBtn;