import React, { useState, useEffect, useRef } from 'react';
import API from '../services/api.js';
import styles from './RoomList.css'; 
import Notification from '../notification/notification.jsx'; 

const RoomListUser = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const [notification, setNotification] = useState(null); 
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all'); 

  const intervalRef = useRef(null); // Track the interval to clear it safely

  // Fetch rooms once when the component mounts
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await API.get('/rooms');
        setRooms(response.data);
      } catch (error) {
        setNotification({ message: 'Error fetching rooms', type: 'error' });
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchRooms();
  }, []);

  // Categories computed safely after rooms load
  const categories = [...new Set(rooms.map(room => room.category))];

  // Check and update reservations periodically
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setRooms((prevRooms) =>
        prevRooms.map((room) => {
          const now = new Date();
          const endTime = new Date(room.reservation?.endTime);

          if (room.isReserved && endTime <= now) {
            return { ...room, isReserved: false, reservation: null };
          }
          return room;
        })
      );
    }, 60000); // Every 1 minute

    return () => clearInterval(intervalRef.current); // Cleanup on unmount
  }, []);

  // Filter logic
  const filteredRooms = rooms.filter((room) => {
    const categoryMatch = selectedCategory ? room.category === selectedCategory : true;
    const filterMatch =
      selectedFilter === 'all'
        ? true
        : selectedFilter === 'reserved'
        ? room.isReserved
        : !room.isReserved;
    return categoryMatch && filterMatch;
  });

  const handleCategoryChange = (event) => setSelectedCategory(event.target.value);
  const handleFilterChange = (event) => setSelectedFilter(event.target.value);

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    const date = new Date(timeString);
    return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const AmOrPm = (timeString) => new Date(timeString).getHours() >= 12 ? 'PM' : 'AM';

  const handleCancelReservation = async (reservationId) => {
    try {
      const response = await API.delete(`/reservations/${reservationId}`);
      setNotification({ message: response.data.message || 'Reservation cancelled!', type: 'success' });

      setRooms((prevRooms) =>
        prevRooms.map((room) =>
          room.reservation?._id === reservationId
            ? { ...room, isReserved: false, reservation: null }
            : room
        )
      );
    } catch (error) {
      setNotification({ message: 'Error cancelling reservation', type: 'error' });
    }
  };

  const handleCloseNotification = () => {
    setNotification(null);
  };

  return (
    <div className="room-list-container">
      <div className="filter-fields">
        <div id="category-field">
          <label htmlFor="filter-select">Select Category:</label>
          <select
            id="filter-select"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div id="status-field">
          <label htmlFor="filter-select">Room Filter:</label>
          <select
            id="filter-select"
            value={selectedFilter}
            onChange={handleFilterChange}
          >
            <option value="all">All Rooms</option>
            <option value="reserved">Reserved Rooms</option>
            <option value="available">Available Rooms</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading-icon">
          <img src="./assets/loading.png" alt="Loading" />
        </div> // Display loading icon
      ) : (
        <div className="room-list-wrapper">
          <ul className="room-list">
            {filteredRooms.length > 0 ? (
              filteredRooms.map((room) => (
                <li
                  key={room._id}
                  className={room.isReserved ? 'room-reserved' : 'room-available'}
                >
                  <div className="room-header">
                    <span
                      className={`status-circle ${
                        room.isReserved ? 'status-red' : 'status-green'
                      }`}
                      ></span>
                    <h2 id="room-name">Room: {room.name || 'Unnamed Room'}</h2>
                  </div>
                  <p id="category">Category: {room.category || 'N/A'}</p>
                  <p id="capacity">Capacity: {room.maxCapacity || 'N/A'}</p>  
                  {room.isReserved ? (
                    <div id="reserved-content-div">
                        <p id="reserved-content">Reserved Room</p>
                      <p id="reserved-content">{formatTime(room.reservation?.startTime)} {AmOrPm(room.reservation?.startTime)} - {formatTime(room.reservation?.endTime)} {AmOrPm(room.reservation?.endTime)} </p>
                    </div>
                  ) : (
                <p>Room is available</p>
                  )}
                </li>
              ))
            ) : (
              <p>No Reservations.</p>
            )}
          </ul>
        </div>
      )}

      {notification && <Notification {...notification} onClose={handleCloseNotification} />}
    </div>
  );
};

export default RoomListUser;