const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  address: { type: String, required: true, trim: true },
  lat: { type: Number },
  lng: { type: Number },
  totalSpots: { type: Number, required: true, default: 100 },
  availableSpots: { type: Number, required: true, default: 100 },
  hourlyRate: { type: Number, required: true, default: 50 },
  status: { type: String, enum: ['active', 'maintenance', 'closed'], default: 'active' },
  operatingHours: { type: String, default: '06:00 - 23:00' },
  amenities: [String],
}, {
  timestamps: true,
});

module.exports = mongoose.model('Location', locationSchema);
