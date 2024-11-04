// StaffReservations.js
import React, { useEffect, useState } from 'react';

const StaffReservations = () => {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    // Fetch all reservations for staff approval
    fetch('/api/all-reservations')
      .then(response => response.json())
      .then(data => setReservations(data));
  }, []);

  const handleApprove = (id) => {
    // Approve reservation (update status in the backend)
    fetch(`/api/reservations/${id}/approve`, { method: 'POST' })
      .then(() => {
        setReservations(reservations.map(r => r.id === id ? { ...r, status: 'approved' } : r));
      });
  };

  const handleDeny = (id) => {
    // Deny reservation (update status in the backend)
    fetch(`/api/reservations/${id}/deny`, { method: 'POST' })
      .then(() => {
        setReservations(reservations.map(r => r.id === id ? { ...r, status: 'denied' } : r));
      });
  };

  return (
    <div>
      <h3>Reservation Requests</h3>
      <ul>
        {reservations.map(reservation => (
          <li key={reservation.id}>
            Room: {reservation.room} | Status: {reservation.status}
            <button onClick={() => handleApprove(reservation.id)}>Approve</button>
            <button onClick={() => handleDeny(reservation.id)}>Deny</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StaffReservations;
