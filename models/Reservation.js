const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
  clientName: { type: String, required: true },
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  attendees: { type: Number, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  category: { type: String, required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' }, // New status field
  requestedBy: { type: String, required: true, enum: ['staff', 'user'] } // New role field
});

const Reservation = mongoose.model('Reservation', ReservationSchema);

module.exports = Reservation;
