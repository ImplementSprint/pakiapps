const mongoose = require('mongoose');

const parkingRateSchema = new mongoose.Schema({
  vehicleType: { type: String, required: true, unique: true },
  hourlyRate: { type: Number, required: true },
  dailyRate: { type: Number, required: true },
}, {
  timestamps: true,
});

module.exports = mongoose.model('ParkingRate', parkingRateSchema);
