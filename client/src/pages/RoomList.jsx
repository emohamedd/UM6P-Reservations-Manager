import React, { useState, useEffect, useRef } from 'react';
import API from '../services/api.js';
import styles from './RoomList.css'; 
import Notification from '../notification/notification.jsx'; 
import AgendaView from '../components/AgendaView'; 

const RoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [notification, setNotification] = useState(null); 
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all'); 
  const [view, setView] = useState('rooms'); 

  const intervalRef = useRef(null); // Track the interval to clear it safely

  // Fetch rooms once when the component mounts
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
  const handleViewChange = (event) => setView(event.target.value);

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

  return (
    <div className="room-list-container">
      <div className="filter-fields">
        <div id="category-field">
          <label htmlFor="category-select">Select Category:</label>
          <select
            id="category-select"
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

        <div id="view-field">
          <label htmlFor="view-select">View:</label>
          <select id="view-select" value={view} onChange={handleViewChange}>
            <option value="rooms">Rooms View</option>
            <option value="agenda">Agenda View</option>
          </select>
        </div>
      </div>

      {view === 'rooms' ? (
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

                  {room.isReserved ? (
                    <div>
                      <p>Reserved by: {room.reservation?.clientName || 'Unknown'}</p>
                      <p>Start: {formatTime(room.reservation?.startTime)} {AmOrPm(room.reservation?.startTime)}</p>
                      <p>End: {formatTime(room.reservation?.endTime)} {AmOrPm(room.reservation?.endTime)}</p>
                      <p>Attendees: {room.reservation?.attendees || 'N/A'}</p>
                      <button onClick={() => handleCancelReservation(room.reservation._id)}>
                        Cancel Reservation
                      </button>
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
      ) : (
        <AgendaView />
      )}

      {notification && <Notification {...notification} />}
    </div>
  );
};

export default RoomList;
