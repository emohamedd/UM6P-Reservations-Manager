// StaffReservations.js
import React, { useEffect, useState } from 'react';
import './StaffReservations.css';


const StaffReservations = () => {
    const [reservations, setReservations] = useState([]);
  
    useEffect(() => {
      fetch('/api/pending-reservations')
        .then(response => response.json())
        .then(data => setReservations(data));
    }, []);
  
    const handleApprove = async (id) => {
      await fetch(`/api/reservations/${id}/approve`, { method: 'POST' });
      setReservations(reservations.filter(reservation => reservation.id !== id));
    };
  
    const handleDeny = async (id) => {
      await fetch(`/api/reservations/${id}/deny`, { method: 'POST' });
      setReservations(reservations.filter(reservation => reservation.id !== id));
    };
  
    return (
      <div>
        <h3>Pending Reservations</h3>
        <ul>
          {reservations.map(reservation => (
            <li key={reservation.id}>
              Room: {reservation.room} | Date: {reservation.date}
              <button onClick={() => handleApprove(reservation.id)}>Approve</button>
              <button onClick={() => handleDeny(reservation.id)}>Deny</button>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default StaffReservations;