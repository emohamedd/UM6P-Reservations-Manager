import React from 'react';
import RoomListUser from '../pages/RoomListUser.jsx';
import ReservationFormUser from './ReservationFormUser';
import UserReservations from './UserReservations';
import LogoutBtn from './LogoutBtn.jsx';
import Header from './header';
import './UserDashboard.css';

const UserDashboard = () => {
  return (
    <div className='user-div'>
        <Header />
      <h2>User Dashboard</h2>
      <ReservationFormUser /> {/* Form for new reservation requests */}
      <UserReservations /> {/* Only shows the user's reservations */}
      <RoomListUser showAvailableRoomsOnly={true} />
        <LogoutBtn />
    </div>
  );
};

export default UserDashboard;
