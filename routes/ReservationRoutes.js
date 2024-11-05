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
  const { clientName, roomId, attendees, startTime, endTime, category, requestedBy } = req.body;

  try {
    const start = new Date(startTime).toISOString();
    const end = new Date(endTime).toISOString();

    if (end <= start) {
      return res.status(400).json({ message: 'End time must be later than start time.' });
    }

    if (start < new Date().toISOString()) {
      return res.status(400).json({ message: 'Start time must be in the future.' });
    }

    const existingReservations = await Reservation.find({
      room: roomId,
      $or: [
        { startTime: { $lt: end }, endTime: { $gt: start } },
        { startTime: { $gte: start, $lt: end } },
        { endTime: { $gt: start, $lte: end } },
        { startTime: { $lte: start }, endTime: { $gte: end } }
      ]
    });

    if (existingReservations.length > 0) {
      return res.status(409).json({ message: 'Room is already reserved for the selected time.' });
    }

    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    if (room.category !== category) {
      return res.status(400).json({ message: 'Selected category does not match the room category.' });
    }

    // Determine initial status based on role
    const status = requestedBy === 'staff' ? 'accepted' : 'pending';

    const newReservation = new Reservation({
      clientName,
      room: room._id,
      attendees,
      startTime: start,
      endTime: end,
      category,
      status,
      requestedBy
    });

    await newReservation.save();

    // For direct staff reservations, update room status immediately
    if (requestedBy === 'staff') {
      room.isReserved = true;
      await room.save();
    }

    res.status(201).json(newReservation);
  } catch (error) {
    console.error('Error creating reservation:', error);
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

router.put('/:reservationId/approve', async (req, res) => {
  const { reservationId } = req.params;
  const { action } = req.body; // "approve" or "reject"

  try {
    const reservation = await Reservation.findById(reservationId);

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    if (reservation.requestedBy === 'staff') {
      return res.status(400).json({ message: 'Staff reservations do not require approval.' });
    }

    // Update status based on the action
    if (action === 'approve') {
      reservation.status = 'accepted';

      const room = await Room.findById(reservation.room);
      room.isReserved = true;
      await room.save();
    } else if (action === 'reject') {
      reservation.status = 'rejected';
    } else {
      return res.status(400).json({ message: 'Invalid action' });
    }

    await reservation.save();
    res.status(200).json({ message: `Reservation ${action}ed successfully`, reservation });
  } catch (error) {
    console.error('Error updating reservation:', error);
    res.status(500).json({ message: 'Error updating reservation' });
  }
});


module.exports = router;