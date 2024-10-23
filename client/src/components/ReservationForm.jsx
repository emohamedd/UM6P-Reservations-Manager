import './ReservationForm.css';
import React, { useState, useEffect } from 'react';
import API from '../services/api.js';  // Assuming API is a helper for Axios requests
import axios from 'axios';
import Notification from '../notification/notification.js';

const ReservationForm = () => {
  const [clientName, setClientName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [attendees, setAttendees] = useState(0);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [rooms, setRooms] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    // Fetch available rooms and categories for the dropdown
    const fetchRoomsAndCategories = async () => {
      try {
        const response = await API.get('/rooms');
        setRooms(response.data);
        const uniqueCategories = [...new Set(response.data.map(room => room.category))];
        setCategories(uniqueCategories);
      } catch (error) {
        setNotification({ message: 'Error fetching rooms', type: 'error' });
      }
    };

    fetchRoomsAndCategories();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const selectedRoom = rooms.find(room => room._id === roomId);

    // Check if attendees exceed room capacity
    if (attendees > selectedRoom.maxCapacity) {
      setNotification({ message: `Attendees exceed room capacity of ${selectedRoom.maxCapacity}.`, type: 'error' });
      return;
    }

    const startTimestamp = new Date(startTime).getTime();
    const endTimestamp = new Date(endTime).getTime();

    if (endTimestamp <= startTimestamp) {
      setNotification({ message: 'End time must be later than start time.', type: 'error' });
      return;
    }

    const reservationData = {
      clientName,
      room: roomId,
      attendees,
      startTime: new Date(startTime).toISOString(),
      endTime: new Date(endTime).toISOString(),
      category: selectedCategory, // Include category in reservation data
    };

    try {
      const response = await axios.post('http://localhost:5000/api/reservations', reservationData);
      setNotification({ message: 'Reservation added successfully!', type: 'success' });
    } catch (error) {
      setNotification({ message: 'Error adding reservation', type: 'error' });
    }
  };

  const filteredRooms = selectedCategory
    ? rooms.filter(room => room.category === selectedCategory)
    : rooms;

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
      <label>
        Client Name:
        <input 
          type="text" 
          value={clientName} 
          onChange={(e) => setClientName(e.target.value.toUpperCase())} 
        />
      </label>
      <label>
        Select Category:
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          <option value="">Select a category</option>
          {categories.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>
      <label>
        Select Room:
        <select value={roomId} onChange={(e) => setRoomId(e.target.value)} disabled={!selectedCategory}>
          <option value="">Select a room</option>
          {filteredRooms.map(room => (
            <option key={room._id} value={room._id}>
              {room.name} (Capacity: {room.maxCapacity})
            </option>
          ))}
        </select>
      </label>
      <label>
        Attendees:
        <input 
          type="number" 
          value={attendees} 
          onChange={(e) => setAttendees(e.target.value)} 
        />
      </label>
      <label>
        Start Time:
        <input 
          type="datetime-local" 
          value={startTime} 
          onChange={(e) => setStartTime(e.target.value)} 
        />
      </label>
      <label>
        End Time:
        <input 
          type="datetime-local" 
          value={endTime} 
          onChange={(e) => setEndTime(e.target.value)} 
        />
      </label>
      <button type="submit">Reserve</button>
      {notification && (
        <p className={notification.type === 'error' ? 'error' : 'success'}>
          {notification.message}
        </p>
      )}
    </form>
    </div>
  );
};

export default ReservationForm;