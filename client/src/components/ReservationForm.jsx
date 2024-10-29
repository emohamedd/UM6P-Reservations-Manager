import './ReservationForm.css';
import React, { useState, useEffect } from 'react';
import API from '../services/api';  // Assuming API is a helper for Axios requests
import axios from 'axios';
import Notification from '../notification/notification.jsx';

const ReservationForm = () => {
  const [clientName, setClientName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [attendees, setAttendees] = useState('');
  const [startTime, setStartTime] = useState(''); // Start time state
  const [endTime, setEndTime] = useState(''); // End time state
  const [rooms, setRooms] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [notification, setNotification] = useState(null); // State for notifications
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000); // 3-second auto-hide
      return () => clearTimeout(timer); // Cleanup on unmount
    }
  }, [notification]);
  
  useEffect(() => {
    // Fetch available rooms for the dropdown
    const fetchRooms = async () => {
      try {
        const response = await API.get('/rooms');
        setRooms(response.data);
        const uniqueCategories = [...new Set(response.data.map(room => room.category))];
        setCategories(uniqueCategories);
      } catch (error) {
        setNotification({ message: 'Error fetching rooms', type: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!clientName || !roomId || !attendees || !startTime || !endTime || !selectedCategory) {
      setNotification({ message: 'Please fill in all required fields.', type: 'error' });
      return;
    }

    
    const selectedRoom = rooms.find(room => room._id === roomId);

    if (!selectedRoom) {
      setNotification({ message: 'Please select a room.', type: 'error' }); // Error notification
      return;
    }
    // Check if attendees exceed room capacity
    if (attendees > selectedRoom.maxCapacity) {
      setNotification({ message: `Attendees exceed room capacity of ${selectedRoom.maxCapacity}.`, type: 'error' });
      return;
    }
    
    const startTimestamp = new Date(startTime).getTime();
    const endTimestamp = new Date(endTime).getTime();
    const now = Date.now();
  if (endTimestamp <= startTimestamp) {
    setNotification({ message: 'End time must be later than start time.', type: 'error' });
    return;
  }
  if (startTimestamp < now) {
    setNotification({ message: 'Start time must be in the future.', type: 'error' });
    return;
  }

    const reservationData = {
      clientName,
      roomId,
      attendees,
      startTime,
      endTime,
      category: selectedCategory,
    };

    try {
      const response = await axios.post('http://localhost:5000/api/reservations', reservationData);
      setNotification({ message: 'Reservation added successfully!', type: 'success' }); // Success notification


        window.location.reload();
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

  const filteredRooms = selectedCategory
    ? rooms.filter((room) => room.category === selectedCategory)
    : rooms;
  
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
        <h2>Reservation Form</h2>

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
          <label>Select Category</label>
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            <option value="">Select a Category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Select Room</label>
          <select
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            disabled={!selectedCategory}
            required
          >
            <option value="">Select a Room</option>
            {filteredRooms.map((room) => (
              <option key={room._id} value={room._id}>
                {room.name} (Capacity: {room.maxCapacity})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Number of Attendees</label>
          <input
            type="number"
            min="1"
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

        <button type="submit" disabled={notification !== null}>Reserve</button>
        </form>
    </div>
  );
};

export default ReservationForm;