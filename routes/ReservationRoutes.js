const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation'); // Adjust the path if necessary
const Room = require('../models/Room'); // Import Room model

router.get('/', async (req, res) => {
  try {
    const reservations = await Reservation.find();
    res.json(reservations);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { clientName, room, attendees, startTime, endTime, category } = req.body;

    if (!clientName || !room || !attendees || !startTime || !endTime || !category) {
      alert('All fields are required.');
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Check for overlapping reservations
    const overlappingReservation = await Reservation.findOne({
      room,
      $or: [
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
      ],
    });

    if (overlappingReservation) {
      return res.status(409).json({ message: 'Room already reserved for the selected time.' });
    }

    // Create new reservation if no conflict
    const newReservation = new Reservation({
      clientName,
      room,
      attendees,
      startTime,
      endTime,
      category,
    });

    await newReservation.save();
    res.status(201).json(newReservation);
  } catch (error) {
    console.error('Error creating reservation:', error);
    res.status(500).json({ message: 'Failed to create reservation.' });
  }
});


router.delete('/:reservationId', async (req, res) => {
  const 
{ reservationId } = req.params;

  try {
    // Find the reservation by ID
    const reservation = await Reservation.findById(reservationId);

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    // Remove the reservation from the database
    await Reservation.findByIdAndDelete(reservationId);

    // Update the room's isReserved status
    const room = await Room.findById(reservation.room);
    if (room) {
      room.isReserved = false; // Set room as available
      await room.save();
    }

    res.status(200).json({ message: 'Reservation cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling reservation:', error);
    res.status(500).json({ message: 'Error cancelling reservation' });
  }
});

module.exports = router;
