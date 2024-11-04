import React, { useState, useEffect } from 'react';
import RoomList from './pages/RoomList';
import ReservationForm from './components/ReservationForm';
import SplashScreen from './components/SplashScreen';
import Header from './components/header';
import Auth from './components/Auth';
import StaffDashboard from './components/StaffDashboard'; // Import staff-specific dashboard
import UserDashboard from './components/UserDashboard'; // Import user-specific dashboard
import './App.css'; 

function App() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null); // Track role after login

  useEffect(() => {
    if (isAuthenticated) {
      const timer = setTimeout(() => setLoading(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);

  const handleLogin = (userRole) => {
    setIsAuthenticated(true);
    setRole(userRole); // Set role based on login credentials
  };

  if (!isAuthenticated) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="App">
      {loading ? (
        <SplashScreen />
      ) : (
        <div className="page-container">
          {role === 'staff' ? <StaffDashboard /> : <UserDashboard />}
        </div>
      )}
    </div>
  );
}

export default App;