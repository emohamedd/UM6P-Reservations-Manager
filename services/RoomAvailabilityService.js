const Room = require('../models/Room');
const Reservation = require('../models/Reservation'); 

async function updateRoomAvailability() {
    const now = new Date();
    const bufferBeforeStart = 20000; 
    const bufferAfterEnd = 40000; 

    const endedReservations = await Reservation.find({ endTime: { $lt: new Date(now.getTime() + bufferAfterEnd) } });
    
    for (const reservation of endedReservations) {
        const room = await Room.findById(reservation.room);
        if (room) {
            room.isReserved = false; // Mark room as available
            await room.save();
        }
    }

    const currentReservations = await Reservation.find({ 
        startTime: { $lt: new Date(now.getTime() + bufferBeforeStart) }, 
        endTime: { $gt: now }
    });

    const reservedRoomIds = currentReservations.map(reservation => reservation.room);

    await Room.updateMany({}, { isReserved: false });

    await Room.updateMany(
        { _id: { $in: reservedRoomIds } },
        { isReserved: true }
    );
}

module.exports = { updateRoomAvailability };
