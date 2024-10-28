import React, { useState, useEffect } from 'react';
import RoomList from './pages/RoomList';
import ReservationForm from './components/ReservationForm';
import SplashScreen from './components/SplashScreen';
import Header from './components/header';
import Auth from './components/Auth'; // Import the authentication component
import './App.css'; // Import your CSS

function App() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track authentication state

  useEffect(() => {
    if (isAuthenticated) {
      // Simulate splash screen loading after successful login (e.g., 3 seconds)
      const timer = setTimeout(() => {
        setLoading(false);
      }, 3000); // Adjust the time as needed

      return () => clearTimeout(timer); // Cleanup timer
    }
  }, [isAuthenticated]); // Only run if authenticated

  // Render the authentication interface if the user is not logged in
  if (!isAuthenticated) {
    return <Auth onLogin={setIsAuthenticated} />;
  }

  // Render the splash screen while loading; show the app after that
  return (
    <div className="App">
      {loading ? (
        <SplashScreen />
      ) : (
        <div className="page-container">
          <Header />
          <div>
            <ReservationForm />
          </div>
          <div>
            <RoomList />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
