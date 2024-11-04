import React from 'react';
import RoomList from '../pages/RoomList';
import StaffReservations from './StaffReservations';
import ReservationForm from './ReservationForm';
import LogoutBtn from './LogoutBtn';
import Header from './header';
import './StaffDashboard.css';

const StaffDashboard = () => {
  return (
      <div className='staff-div'>
        <Header />
      <h2>Staff Dashboard</h2>
        <ReservationForm /> 
      <StaffReservations />
      <RoomList showAllRooms={true} />
       <LogoutBtn />
    </div>
  );
};

export default StaffDashboard;
