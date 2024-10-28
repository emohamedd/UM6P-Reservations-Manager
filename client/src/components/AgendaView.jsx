import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './AgendaView.css'; // Import custom CSS
import API from '../services/api.js';

const localizer = momentLocalizer(moment);

const AgendaView = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchReservationsAndRooms = async () => {
      try {
        const reservationsResponse = await API.get('/reservations');
        const roomsResponse = await API.get('/rooms');

        const roomsMap = roomsResponse.data.reduce((acc, room) => {
          acc[room._id] = room.name;
          return acc;
        }, {});

        const reservations = reservationsResponse.data.map(reservation => {
        const isCurrent = new Date(reservation.startTime) <= new Date() && new Date(reservation.endTime) >= new Date();
          const isEnded = new Date(reservation.endTime) <= new Date();
          return {
            title: `Room: ${roomsMap[reservation.room]} - Reserved by: ${reservation.clientName}`,
            start: new Date(reservation.startTime),
            end: new Date(reservation.endTime),
            attendees: reservation.attendees,
            isEnded,
          };
        });

        setEvents(reservations);
      } catch (error) {
        console.error('Error fetching reservations and rooms:', error);
      }
    };

    fetchReservationsAndRooms();
  }, []);

  const eventStyleGetter = (event) => {
    const backgroundColor = event.isEnded ? '#dc3545' : '#28a745';
    const style = {
      backgroundColor,
      color: 'white',
      borderRadius: '5px',
      padding: '5px',
      fontSize: '16px',
    };
    return {
      style,
    };
  };

  return (
    <div className="agenda-view">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%', width: '100%' }}
        eventPropGetter={eventStyleGetter}
        components={{
          event: ({ event }) => (
            <div className="rbc-event-content">
              <span>{event.title}</span>
              <span>Attendees: {event.attendees}</span>
              {event.isEnded && <span>(Ended)</span>}
              {!event.isEnded && <span>(Ongoing)</span>}
            </div>
          ),
        }}
      />
    </div>
  );
};

export default AgendaView;