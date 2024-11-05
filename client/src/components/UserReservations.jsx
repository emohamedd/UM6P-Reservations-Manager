// UserReservations.js
import React, { useEffect, useState } from 'react';
import './UserReservations.css';
import API from '../services/api.js';

const UserReservations = () => {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await API.get('/reservations');
        setReservations(response.data);
      } catch (error) {
        console.error('Error fetching reservations:', error);
      }
    };
  }, []);

  return (
    <div className='div-reserv'>
      <h3>Your Reservations</h3>
      <ul className='user-reserv'>
        {reservations.map(reservation => (
          <li key={reservation.id}>
            Room: {reservation.room.name} | Status: {reservation.status}

          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserReservations;
