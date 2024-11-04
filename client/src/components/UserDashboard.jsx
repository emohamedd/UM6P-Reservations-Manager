import React from 'react';
import RoomList from '../pages/RoomList';
import ReservationForm from './ReservationForm';
import UserReservations from './UserReservations';
import LogoutBtn from './LogoutBtn.jsx';
import Header from './header';
import './UserDashboard.css';

const UserDashboard = () => {
  return (
    <div className='user-div'>
        <Header />
      <h2>User Dashboard</h2>
      <ReservationForm /> {/* Form for new reservation requests */}
      <UserReservations /> {/* Only shows the user's reservations */}
      <RoomList showAvailableRoomsOnly={true} />
        <LogoutBtn />
    </div>
  );
};

export default UserDashboard;
