import React, { useState, useEffect } from 'react';
import RoomList from './pages/RoomList';
import ReservationForm from './components/ReservationForm';
import SplashScreen from './components/SplashScreen';
import './App.css'; // Import your CSS

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate a splash screen loading time (e.g., 3 seconds)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000); // Adjust the time as needed (in milliseconds)

    return () => clearTimeout(timer); // Cleanup the timer
  }, []);

  return (
    <div className="App">
      {loading ? (
        <SplashScreen />
      ) : (
        <div className="page-container">
          <RoomList />
          <ReservationForm />
        </div>
      )}
    </div>
  );
}

export default App;
