import React, { useState, useEffect } from 'react';
import API from '../services/api.js';
import './RoomList.css'; // Ensure CSS file is correctly imported
import Notification from '../notification/notification.jsx'; // Import your Notification component
import AgendaView from '../components/AgendaView'; // Import the AgendaView component

const RoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [notification, setNotification] = useState(null); // Notification state
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all'); // New state for the selected filter
  const [view, setView] = useState('rooms'); // New state for toggling views

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
  
  useEffect(() => {
    const interval = setInterval(() => {
      const updatedRooms = rooms.map(room => {
        if (room.isReserved && new Date(room.reservation.endTime) <= new Date()) {
          return { ...room, isReserved: false, reservation: null };
        }
        return room;
      });
      setRooms(updatedRooms);
    }, 60000); // Check every minute

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [rooms]);

  // Filtered rooms logic inside the component body
  const filteredRooms = rooms.filter(room => {
    const categoryMatch = selectedCategory ? room.category === selectedCategory : true;
    const filterMatch =
      selectedFilter === 'all'
        ? true
        : selectedFilter === 'reserved'
        ? room.isReserved
        : !room.isReserved;
    return categoryMatch && filterMatch;
  });

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleFilterChange = (event) => {
    setSelectedFilter(event.target.value);
  };

  const handleViewChange = (event) => {
    setView(event.target.value);
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
      <div className='filter-fields'>
        <div id="category-field">
          <label htmlFor="category-select">Select Category:</label>
          <select id="category-select" onChange={handleCategoryChange}>
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
          <select id="filter-select" onChange={handleFilterChange}>
            <option value="all">All Rooms</option>
            <option value="reserved">Reserved Rooms</option>
            <option value="available">Available Rooms</option>
          </select>
        </div>

        <div id="view-field">
          <label htmlFor="view-select">View:</label>
          <select id="view-select" onChange={handleViewChange}>
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
                      <p id="reserved">Reserved by: {room.reservation?.clientName || 'Unknown'}</p>
                      <p id="start">
                        Start Time: {formatTime(room.reservation?.startTime)}{' '}
                        {AmOrPm(room.reservation?.startTime)}
                      </p>
                      <p id="end">
                        End Time: {formatTime(room.reservation?.endTime)}{' '}
                        {AmOrPm(room.reservation?.endTime)}
                      </p>
                      <p id="attendees">Attendees: {room.reservation?.attendees || 'N/A'}</p>
                      <button
                        className="button"
                        onClick={() => handleCancelReservation(room.reservation._id)}
                      >
                        Cancel Reservation
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p id="room-status-g">Room is available</p>
                      <span id="capacity">{room.maxCapacity} Max</span>
                    </div>
                  )}
                </li>
              ))
            ) : (
              <p id="room-status-r">No rooms available.</p>
            )}
          </ul>
        </div>
      ) : (
        <AgendaView />
      )}

      {notification && (
        <Notification message={notification.message} type={notification.type} />
      )}
    </div>
  );
};

export default RoomList;