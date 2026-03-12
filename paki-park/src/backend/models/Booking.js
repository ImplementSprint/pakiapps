const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  locationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
  reference: { type: String, unique: true, required: true },
  spot: { type: String, required: true },
  date: { type: Date, required: true },
  timeSlot: { type: String, required: true }, // e.g. "10:00 - 11:00"
  type: { type: String, default: '1-Hour Slot' },
  status: { type: String, enum: ['upcoming', 'active', 'completed', 'cancelled'], default: 'upcoming' },
  amount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['GCash', 'PayMaya', 'Credit/Debit Card', 'Cash on Site'], required: true },
  paymentStatus: { type: String, enum: ['paid', 'pending', 'partial', 'refunded'], default: 'pending' },
  cancelledAt: { type: Date },
  cancelReason: { type: String },
}, {
  timestamps: true,
});

// Auto-generate reference number before save
bookingSchema.pre('save', async function (next) {
  if (!this.reference) {
    const count = await mongoose.model('Booking').countDocuments();
    this.reference = `PKP-${String(count + 1).padStart(8, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
