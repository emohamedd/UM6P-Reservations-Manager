import React, { useState, useEffect } from 'react';
import API from '../services/api';
import './RoomList.css'; // Make sure to include your CSS file

const RoomList = () => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
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

  function formatTime(timeString) {
    if (!timeString) return 'N/A';

    const date = new Date(timeString);
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');

    if (hours >= 12) {
      return `${hours}:${minutes}`;
    } else {
      return `${hours}:${minutes}`;
    }
  }

  function AmOrPm(timeString) {
    const date = new Date(timeString);
    const hours = date.getHours();
    if (hours >= 12) return "PM";
    else return "AM";
  }

  const handleCancelReservation = async (reservationId) => {
    try {
      const response = await API.delete(`/reservations/${reservationId}`);
      console.log(response.data.message);
  
      // Update local state to remove the reservation
      setRooms((prevRooms) =>
        prevRooms.map((room) =>
          room.reservation && room.reservation._id === reservationId
            ? { ...room, isReserved: false, reservation: null }
            : room
        )
      );
    } catch (error) {
      // Log the complete error object to understand the issue
      console.error('Error cancelling reservation:', error);
      console.error('Error response data:', error.response?.data);
      console.error('Error status:', error.response?.status);
    }
  };
  

  return (
    <div className="room-list">
      <h1>Rooms List</h1>
      <ul>
        {rooms.length > 0 ? (
          rooms.map((room) => (
            <li key={room._id} className={room.isReserved ? 'room-reserved' : 'room-available'}>
              <h2>Room: {room.name || 'Unnamed Room'}</h2>
              {room.isReserved ? (
                <div>
                  <p id="reserved">Reserved by: {room.reservation?.clientName || 'Unknown'}</p>
                  <p id="start">Start Time: {formatTime(room.reservation?.startTime)} {AmOrPm(room.reservation?.startTime)}</p>
                  <p id="end">End Time: {formatTime(room.reservation?.endTime)} {AmOrPm(room.reservation?.endTime)}</p>
                  <p id="attendees">Attendees: {room.reservation?.attendees || 'N/A'}</p>
                  <button className='button' onClick={() => handleCancelReservation(room.reservation._id)}>Cancel Reservation</button>
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
