const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  phone: { type: String, trim: true },
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  profilePicture: { type: String, default: null },
  address: {
    street: String,
    city: String,
    province: String,
  },
  dateOfBirth: { type: Date },
  isVerified: { type: Boolean, default: false },
  // Business Partner specific fields
  documents: {
    businessPermit: String,
    dtiSec: String,
    proofOfOwnership: String,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('User', userSchema);
