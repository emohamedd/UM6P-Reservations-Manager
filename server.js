const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const { updateRoomAvailability } = require('./services/RoomAvailabilityService')


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: '*' })); // Allow all origins (or specify your friend's domain)
app.use(express.json()); // Add this line

app.get('/', (req, res) => {
  res.send('Conference Room Reservation API');
});

mongoose.connect(process.env.MONGO_URI, {
  ssl: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

  updateRoomAvailability().then(() => {
  });

  setInterval(updateRoomAvailability, 60 * 1000); // Check every minute

app.listen(PORT, '0.0.0.0' , () => {
  console.log(`Server is running on port ${PORT}`);
});

const roomRoutes = require('./routes/RoomRoutes');
const reservationRoutes = require('./routes/ReservationRoutes');
const api = require('/api');

app.use('/api/rooms', roomRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api', api);

