import './ReservationForm.css';
import React, { useState, useEffect } from 'react';
import API from '../services/api';  // Assuming API is a helper for Axios requests
import axios from 'axios';

const ReservationForm = () => {
  const [clientName, setClientName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [attendees, setAttendees] = useState('');
  const [startTime, setStartTime] = useState(''); // Start time state
  const [endTime, setEndTime] = useState(''); // End time state
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    // Fetch available rooms for the dropdown
    const fetchRooms = async () => {
      try {
        const response = await API.get('/rooms');
        setRooms(response.data);
      } catch (error) {
        console.error('Error fetching rooms:', error);
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
      console.log('Reservation added:', response.data);
    } catch (error) {
      console.error('Error adding reservation:', error);
    }
  };
  

  return (
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
  );
};

export default ReservationForm;
