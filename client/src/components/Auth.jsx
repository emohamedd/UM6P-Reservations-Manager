import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie'; // Import the js-cookie library
import './Auth.css'; // Ensure the CSS matches the styling below

const Auth = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [notification, setNotification] = useState(null);

  // Check for saved login state in cookies
  useEffect(() => {
    const isLoggedIn = Cookies.get('isLoggedIn');
    if (isLoggedIn) {
      onLogin(true); // Call the onLogin function to update the parent component's state
    }
  }, [onLogin]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const validUsername = 'test';
    const validPassword = 'test';

    if (username === validUsername && password === validPassword) {
      Cookies.set('isLoggedIn', 'true', { expires: 7 }); // Save login state in cookies for 7 days
      setNotification({ message: 'Login successful', type: 'success' });
      onLogin(true); // Call the onLogin function to update the parent component's state
    } else {
      setError('Invalid username or password.');
    }
  };

  const handleLogout = () => {
    Cookies.remove('isLoggedIn'); // Clear the login state from cookies
    onLogin(false); // Call the onLogin function to update the parent component's state
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
        </footer>
      </div>
    </div>
  );
};

export default Auth;
