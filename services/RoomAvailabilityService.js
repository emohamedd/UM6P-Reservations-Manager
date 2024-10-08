const Room = require('../models/Room'); // Adjust the path if necessary
const Reservation = require('../models/Reservation'); // Adjust the path if necessary

async function updateRoomAvailability() {
    const now = new Date();
    const bufferBeforeStart = 20000; // 20 seconds before start time
    const bufferAfterEnd = 40000; // 40 seconds after end time

    // Find all reservations that should have ended (including the buffer)
    const endedReservations = await Reservation.find({ endTime: { $lt: new Date(now.getTime() + bufferAfterEnd) } });
    
    // Set rooms from ended reservations to available
    for (const reservation of endedReservations) {
        const room = await Room.findById(reservation.room);
        if (room) {
            console.log(`Setting room ${room.name} to available (Reservation ended)`);
            room.isReserved = false; // Mark room as available
            await room.save();
        }
    }

    // Find all current reservations (accounting for the buffer before start)
    const currentReservations = await Reservation.find({ 
        startTime: { $lt: new Date(now.getTime() + bufferBeforeStart) }, // Reservation starts within the next 20 seconds
        endTime: { $gt: now } // Reservation has not ended yet
    });

    const reservedRoomIds = currentReservations.map(reservation => reservation.room);

    // First, set all rooms as available
    await Room.updateMany({}, { isReserved: false });
    console.log(`All rooms marked as available`);

    // Set rooms with current reservations as reserved
    await Room.updateMany(
        { _id: { $in: reservedRoomIds } },
        { isReserved: true }
    );
    console.log(`Rooms with current reservations set to reserved: ${reservedRoomIds}`);
}

module.exports = { updateRoomAvailability };
