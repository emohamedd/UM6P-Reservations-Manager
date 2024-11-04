// UserReservations.js
import React, { useEffect, useState } from 'react';

const UserReservations = () => {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    // Fetch user's reservations from the server (filtered by logged-in user)
    // Example API call (replace with actual endpoint)
    fetch('/api/user-reservations')
      .then(response => response.json())
      .then(data => setReservations(data));
  }, []);

  return (
    <div>
      <h3>Your Reservations</h3>
      <ul>
        {reservations.map(reservation => (
          <li key={reservation.id}>
            Room: {reservation.room} | Status: {reservation.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserReservations;
