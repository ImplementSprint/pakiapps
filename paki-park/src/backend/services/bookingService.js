const Booking = require('../models/Booking');
const Location = require('../models/Location');

/**
 * Create a new booking
 */
const createBooking = async ({ userId, vehicleId, locationId, spot, date, timeSlot, amount, paymentMethod }) => {
  // Check if slot is available
  const existingBooking = await Booking.findOne({
    locationId,
    spot,
    date,
    timeSlot,
    status: { $in: ['upcoming', 'active'] },
  });

  if (existingBooking) {
    throw new Error('This time slot is already booked');
  }

  const booking = await Booking.create({
    userId,
    vehicleId,
    locationId,
    spot,
    date,
    timeSlot,
    amount,
    paymentMethod,
    paymentStatus: 'paid',
    status: 'upcoming',
  });

  // Decrement available spots
  await Location.findByIdAndUpdate(locationId, { $inc: { availableSpots: -1 } });

  return booking.populate(['vehicleId', 'locationId']);
};

/**
 * Get bookings for a user
 */
const getUserBookings = async (userId, { status, search, page = 1, limit = 20 }) => {
  const query = { userId };

  if (status && status !== 'all') {
    query.status = status;
  }

  const bookings = await Booking.find(query)
    .populate('vehicleId', 'brand model plateNumber type')
    .populate('locationId', 'name address')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await Booking.countDocuments(query);

  return { bookings, total, page, totalPages: Math.ceil(total / limit) };
};

/**
 * Get all bookings (admin)
 */
const getAllBookings = async ({ status, search, page = 1, limit = 20 }) => {
  const query = {};

  if (status && status !== 'all') {
    query.status = status;
  }

  const bookings = await Booking.find(query)
    .populate('userId', 'name email phone')
    .populate('vehicleId', 'brand model plateNumber type')
    .populate('locationId', 'name address')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await Booking.countDocuments(query);

  return { bookings, total, page, totalPages: Math.ceil(total / limit) };
};

/**
 * Cancel a booking
 */
const cancelBooking = async (bookingId, userId, reason) => {
  const booking = await Booking.findOne({ _id: bookingId, userId });

  if (!booking) throw new Error('Booking not found');
  if (booking.status === 'cancelled') throw new Error('Booking already cancelled');
  if (booking.status === 'completed') throw new Error('Cannot cancel a completed booking');

  booking.status = 'cancelled';
  booking.cancelledAt = new Date();
  booking.cancelReason = reason || 'User cancelled';
  await booking.save();

  // Increment available spots
  await Location.findByIdAndUpdate(booking.locationId, { $inc: { availableSpots: 1 } });

  return booking;
};

/**
 * Get available time slots for a location on a date
 */
const getAvailableSlots = async (locationId, date) => {
  const allSlots = [];
  for (let h = 6; h <= 22; h++) {
    const start = `${h.toString().padStart(2, '0')}:00`;
    const end = `${(h + 1).toString().padStart(2, '0')}:00`;
    allSlots.push(`${start} - ${end}`);
  }

  const bookedSlots = await Booking.find({
    locationId,
    date,
    status: { $in: ['upcoming', 'active'] },
  }).select('timeSlot spot');

  // Group booked slots by timeSlot
  const slotOccupancy = {};
  bookedSlots.forEach((b) => {
    slotOccupancy[b.timeSlot] = (slotOccupancy[b.timeSlot] || 0) + 1;
  });

  const location = await Location.findById(locationId);
  const totalSpots = location?.totalSpots || 100;

  return allSlots.map((slot) => ({
    slot,
    booked: slotOccupancy[slot] || 0,
    available: totalSpots - (slotOccupancy[slot] || 0),
    isFull: (slotOccupancy[slot] || 0) >= totalSpots,
  }));
};

module.exports = { createBooking, getUserBookings, getAllBookings, cancelBooking, getAvailableSlots };
