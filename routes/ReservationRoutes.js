const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation'); // Adjust the path if necessary
const Room = require('../models/Room'); // Import Room model

router.post('/', async (req, res) => {
  const { clientName, roomId, attendees, startTime, endTime, category } = req.body;

  try {
    // Check for overlapping reservations
    const existingReservations = await Reservation.find({
      room: roomId,
      $or: [
        { startTime: { $lt: endTime, $gt: startTime } }, // Overlaps if startTime is between existing endTime and startTime
        { endTime: { $gt: startTime, $lt: endTime } }, // Overlaps if endTime is between existing startTime and endTime
        { startTime: { $lte: startTime }, endTime: { $gte: endTime } } // Fully overlaps
      ]
    });

    // If there are any existing reservations, return a conflict error
    if (existingReservations.length > 0) {
      return res.status(409).json({ message: 'Room is already reserved for the selected time.' });
    }

    // Find the room by ID
    const room = await Room.findById(roomId);

    // Check if the room exists
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Check if the room's category matches the selected category
    if (room.category !== category) {
      return res.status(400).json({ message: 'Selected category does not match the room category.' });
    }

    // Check if room is currently reserved
    if (room.isReserved) {
      return res.status(409).json({ message: 'Room is already reserved.' });
    }

    // Create a new reservation
    const newReservation = new Reservation({
      clientName,
      room: room._id, // Use room ID
      attendees,
      startTime,
      endTime,
      category, // Include category
    });

    // Save reservation
    await newReservation.save();

    // Update room to set isReserved to true
    room.isReserved = true; // Set room as reserved
    await room.save();

    res.status(201).json(newReservation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating reservation' });
  }
});

router.delete('/:reservationId', async (req, res) => {
  const { reservationId } = req.params;

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