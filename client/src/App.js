import React, { useState, useEffect } from 'react';
import RoomList from './pages/RoomList';
import ReservationForm from './components/ReservationForm';
import SplashScreen from './components/SplashScreen';
import './App.css'; // Import your CSS
import Header from './components/header';

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
        <>
        <div className="page-container">
        <Header /> 
          <div>
            <ReservationForm />
          </div>
          <div>
            <RoomList />
          </div>
        </div>
      </>
      )}
    </div>
  );
}

export default App;
