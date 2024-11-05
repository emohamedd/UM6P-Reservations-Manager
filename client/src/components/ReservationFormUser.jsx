import './ReservationForm.css';
import React, { useState, useEffect } from 'react';
import API from '../services/api'; 
import axios from 'axios';
import Notification from '../notification/notification.jsx';

const ReservationFormUser = () => {
  const [clientName, setClientName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [attendees, setAttendees] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [rooms, setRooms] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  useEffect(() => {
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
    const role = 'user';
    if (!clientName || !roomId || !attendees || !startTime || !endTime || !selectedCategory) {
      setNotification({ message: 'Please fill in all required fields.', type: 'error' });
      return;
    }

    const selectedRoom = rooms.find(room => room._id === roomId);
    if (!selectedRoom || attendees > selectedRoom.maxCapacity) {
      setNotification({
        message: selectedRoom ? 
          `Attendees exceed room capacity of ${selectedRoom.maxCapacity}.` :
          'Please select a valid room.', 
        type: 'error'
      });
      return;
    }

    const startTimestamp = new Date(startTime).getTime();
    const endTimestamp = new Date(endTime).getTime();
    if (endTimestamp <= startTimestamp || startTimestamp < Date.now()) {
      setNotification({ message: 'Invalid time range.', type: 'error' });
      return;
    }

    const reservationData = { clientName, roomId, attendees, startTime, endTime, category: selectedCategory, requestedBy: role };
    try {
      const response = await axios.post('http://localhost:5000/api/reservations', reservationData);
      if (response.status === 201) {
        setNotification({ message: 'Reservation added successfully!', type: 'success' });
        setClientName('');
        setRoomId('');
        setAttendees('');
        setStartTime('');
        setEndTime('');
        window.location.reload();
      }
    } catch (error) {
      setNotification({ message: 'Error adding reservation', type: 'error' });
      console.error('Error adding reservation:', error);
    }
  };

  const filteredRooms = selectedCategory
    ? rooms.filter(room => room.category === selectedCategory)
    : rooms;

  return (
    <div className="reservation-container">
      {notification && (
        <Notification 
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <form onSubmit={handleSubmit}>
        <h2>Make a Reservation</h2>
        <div className="input-group">
          <label>Your Name</label>
          <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} required />
        </div>
        <div className="input-group">
          <label>Select Category</label>
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            <option value="">Select a Category</option>
            {categories.map(category => <option key={category}>{category}</option>)}
          </select>
        </div>
        <div className="input-group">
          <label>Select Room</label>
          <select value={roomId} onChange={(e) => setRoomId(e.target.value)} required disabled={!selectedCategory}>
            <option value="">Select a Room</option>
            {filteredRooms.map(room => (
              <option key={room._id} value={room._id}>
                {room.name} (Capacity: {room.maxCapacity})
              </option>
            ))}
          </select>
        </div>
        <div className="input-group">
          <label>Number of Attendees</label>
          <input type="number" min="1" value={attendees} onChange={(e) => setAttendees(e.target.value)} required />
        </div>
        <div className="input-group">
          <label>Reservation Start Time</label>
          <input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
        </div>
        <div className="input-group">
          <label>Reservation End Time</label>
          <input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
        </div>
        <button id="reserve-btn" type="submit">Create a Ticket</button>
      </form>
    </div>
  );
};

export default ReservationFormUser;
