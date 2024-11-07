import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie'; 
import './Auth.css'; 


const Auth = ({ onLogin , userRole}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [notification, setNotification] = useState(null);

  
  useEffect(() => {
    const isLoggedIn = Cookies.get('isLoggedIn');
    if (isLoggedIn) {
      const role = Cookies.get('role');
      onLogin(role); 
    }
  }, [onLogin]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === 'um6p-staff' && password === 'um6p-staff') {
      Cookies.set('isLoggedIn', 'true', { expires: 7 });
      Cookies.set('role', 'staff');
      onLogin('staff'); 
    } else if (username === 'um6p-guest' && password === 'um6p-guest') {
      Cookies.set('isLoggedIn', 'true', { expires: 7 });
      Cookies.set('role', 'user');
      onLogin('user');
    } else {
      setError('Invalid username or password.');

    }
  };
  

  const handleLogout = () => {
    Cookies.remove('isLoggedIn'); 
    Cookies.remove('role');
  };

  return (
    <div className="auth-container">
      {/* Left panel with only the background image */}
      <div className="left-panel"></div>

      {/* Right panel with form, logo, and welcome text */}
      <div className="right-panel">
        <img src="./assets/UM6Ps.svg" alt="UM6P Logo" className="um6p-logo" />
        <h2>Welcome to UM6P Reservations</h2>
        <p className="tagline">Exclusive Access for UM6P Staff Only</p>

        {/* Show the form only if the user is not logged in */}
        {!Cookies.get('isLoggedIn') ? (
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
              />
            </div>

            {error && <p className="error">{error}</p>}
            <button id="login-btn" type="submit">Login</button>
          </form>
        ) : (
          <div>
            <h2>You are already logged in!</h2>
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}

        <footer>
          <p>Unauthorized access is prohibited. For UM6P staff only.</p>
          <code>
           UM6P Reservations made by <a href="https://github.com/emohamedd" target="_blank" rel="noopener noreferrer">Emohamedd</a>
          </code>
        </footer>

      </div>
    </div>
  );
};

export default Auth;
