import './ReservationForm.css';
import React, { useState, useEffect } from 'react';
import API from '../services/api';  // Assuming API is a helper for Axios requests
import axios from 'axios';
import Notification from '../notification/notification.js';

const ReservationForm = () => {
  const [clientName, setClientName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [attendees, setAttendees] = useState('');
  const [startTime, setStartTime] = useState(''); // Start time state
  const [endTime, setEndTime] = useState(''); // End time state
  const [rooms, setRooms] = useState([]);
  const [notification, setNotification] = useState(null); // State for notifications

  useEffect(() => {
    // Fetch available rooms for the dropdown
    const fetchRooms = async () => {
      try {
        const response = await API.get('/rooms');
        setRooms(response.data);
      } catch (error) {
        setNotification({ message: 'Error fetching rooms', type: 'error' }); // Set error notification
      }
    };

    fetchRooms();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const reservationData = {
      clientName,
      roomId,
      attendees,
      startTime,
      endTime,
    };

    try {
      const response = await axios.post('http://localhost:5000/api/reservations', reservationData);
      setNotification({ message: 'Reservation added successfully!', type: 'success' }); // Success notification
      // Reset form fields after successful reservation
      setClientName('');
      setRoomId('');
      setAttendees('');
      setStartTime('');
      setEndTime('');
    } catch (error) {
      setNotification({ message: 'Error adding reservation', type: 'error' }); // Error notification
      console.error('Error adding reservation:', error);
    }
  };

  return (
    <div className='container'>
      {/* Display notification if it exists */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)} // Clear notification on close
        />
      )}

      <form onSubmit={handleSubmit}>
        <h2>Make a Reservation</h2>

        <div>
          <label>Client Name</label>
          <input
            type="text"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Room</label>
          <select value={roomId} onChange={(e) => setRoomId(e.target.value)} required>
            <option value="">Select a Room</option>
            {rooms.map((room) => (
              <option key={room._id} value={room._id}>
                {room.name} (Max: {room.maxCapacity})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Number of Attendees</label>
          <input
            type="number"
            value={attendees}
            onChange={(e) => setAttendees(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Reservation Start Time</label>
          <input
            type="datetime-local" // Using datetime-local input for picking date & time
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Reservation End Time</label>
          <input
            type="datetime-local" // Using datetime-local input for picking date & time
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </div>

        <button type="submit">Reserve</button>
      </form>
    </div>
  );
};

export default ReservationForm;
