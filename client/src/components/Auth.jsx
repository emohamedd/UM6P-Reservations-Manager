import React, { useState } from 'react';
import Header from './header'; // Adjust the path if necessary
import './Auth.css'; // Import your CSS file for styling
const Auth = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [notification, setNotification] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Hardcoded credentials
    const validUsername = 'test';
    const validPassword = 'test';

    if (username === validUsername && password === validPassword) {
      setNotification({ message: 'Login successful', type: 'success' });
      onLogin(true); // Allow access to the app
    } else {
      setError('Invalid username or password.');
    }
  };

  return (
    <div className="auth-containers">
      <form className="auth-forms" onSubmit={handleSubmit}>
      <img src="./assets/UM6Ps.svg" alt="UM6P Logo" className="um6p-logos" />
        <h2>Welcome to UM6P Reservations</h2>
        <p className="taglines">Exclusive Access for UM6P Staff Only</p>
        <div className="input-groups">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
          />
        </div>
        <div className="input-groups">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />
        </div>
        {error && <p className="errors">{error}</p>}
        <button id="login-btn"type="submit">Login</button>
        <footer>
          <p>Unauthorized access is prohibited. For UM6P staff only.</p>
        </footer>
      </form>
    </div>
  );
};

export default Auth;


