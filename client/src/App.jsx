import React, { useState, useEffect } from 'react';
import RoomList from './pages/RoomList';
import ReservationForm from './components/ReservationForm';
import SplashScreen from './components/SplashScreen';
import Header from './components/header';
import Auth from './components/Auth'; 
import './App.css'; 

function App() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false); 

  useEffect(() => {
    if (isAuthenticated) {
      
      const timer = setTimeout(() => {
        setLoading(false);
      }, 3000); 

      return () => clearTimeout(timer); 
    }
  }, [isAuthenticated]); 

  
  if (!isAuthenticated) {
    return <Auth onLogin={setIsAuthenticated} />;
  }

  
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
