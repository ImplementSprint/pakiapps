const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  brand: { type: String, required: true, trim: true },
  model: { type: String, required: true, trim: true },
  color: { type: String, required: true, trim: true },
  plateNumber: { type: String, required: true, uppercase: true, trim: true },
  type: { type: String, enum: ['sedan', 'suv', 'van', 'truck', 'motorcycle', 'hatchback', 'pickup'], default: 'sedan' },
  orDoc: { type: String, default: null },
  crDoc: { type: String, default: null },
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
