const Room = require('../models/Room');
const Reservation = require('../models/Reservation');

async function updateRoomAvailability() {
    const now = new Date();

    // Mark rooms as available for reservations that have ended
    const endedReservations = await Reservation.find({ endTime: { $lt: now } });
    
    for (const reservation of endedReservations) {
        const room = await Room.findById(reservation.room);
        if (room) {
            room.isReserved = false; 
            await room.save();
        }
    }

    // Get current reservations that are active (ongoing)
    const currentReservations = await Reservation.find({
        startTime: { $lte: now },
        endTime: { $gte: now },
        status: { $in: ['accepted', 'pending'] } // Include both accepted and pending reservations
    });

    const reservedRoomIds = currentReservations.map(reservation => reservation.room);

    // Reset all rooms to not reserved first
    await Room.updateMany({}, { isReserved: false });

    // Set rooms as reserved based on current reservations
    await Room.updateMany(
        { _id: { $in: reservedRoomIds } },
        { isReserved: true }
    );
}

module.exports = { updateRoomAvailability };
