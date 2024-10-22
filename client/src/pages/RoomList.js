import React, { useState, useEffect } from 'react';
import API from '../services/api';
import './RoomList.css'; // Ensure CSS file is correctly imported
import Notification from '../notification/notification.js'; // Import your Notification component

const RoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [notification, setNotification] = useState(null); // Notification state
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await API.get('/rooms');
        setRooms(response.data);
      } catch (error) {
        setNotification({ message: 'Error fetching rooms', type: 'error' });
      }
    };

    fetchRooms();
  }, []);

  // Ensure categories are computed safely after rooms are loaded
  const categories = [...new Set(rooms.map(room => room.category))];

  // Filtered rooms logic inside the component body
  const filteredRooms = selectedCategory
    ? rooms.filter(room => room.category === selectedCategory)
    : rooms;

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    const date = new Date(timeString);
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const AmOrPm = (timeString) => {
    const date = new Date(timeString);
    return date.getHours() >= 12 ? 'PM' : 'AM';
  };

  const handleCancelReservation = async (reservationId) => {
    try {
      const response = await API.delete(`/reservations/${reservationId}`);
      setNotification({ message: response.data.message || 'Reservation cancelled!', type: 'success' });

      setRooms((prevRooms) =>
        prevRooms.map((room) =>
          room.reservation && room.reservation._id === reservationId
            ? { ...room, isReserved: false, reservation: null }
            : room
        )
      );
    } catch (error) {
      setNotification({ message: 'Error cancelling reservation', type: 'error' });
    }
  };

  return (
    <div className="room-list-container">
      <label htmlFor="category-select">Select Category:</label>
      <select id="category-select" onChange={handleCategoryChange}>
        <option value="">All Categories</option>
        {categories.map(category => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>

      <ul className="room-list">
        {filteredRooms.length > 0 ? (
          filteredRooms.map((room) => (
            <li key={room._id} className={room.isReserved ? 'room-reserved' : 'room-available'}>
              <h2>Room: {room.name || 'Unnamed Room'}</h2>
              <p>Category: {room.category || 'N/A'}</p>
              {room.isReserved ? (
                <div>
                  <p id="reserved">Reserved by: {room.reservation?.clientName || 'Unknown'}</p>
                  <p id="start">Start Time: {formatTime(room.reservation?.startTime)} {AmOrPm(room.reservation?.startTime)}</p>
                  <p id="end">End Time: {formatTime(room.reservation?.endTime)} {AmOrPm(room.reservation?.endTime)}</p>
                  <p id="attendees">Attendees: {room.reservation?.attendees || 'N/A'}</p>
                  <button className="button" onClick={() => handleCancelReservation(room.reservation._id)}>Cancel Reservation</button>
                </div>
              ) : (
                <div>
                  <p id="room-status">Room is available</p>
                  <span>{room.maxCapacity} Person</span>
                </div>
              )}
            </li>
          ))
        ) : (
          <p id="room-status">No rooms available.</p>
        )}
      </ul>
    </div>
  );
};

export default RoomList;
