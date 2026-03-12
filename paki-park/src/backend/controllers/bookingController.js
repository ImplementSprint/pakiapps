const bookingService = require('../services/bookingService');

// POST /api/bookings
const createBooking = async (req, res) => {
  try {
    const booking = await bookingService.createBooking({
      userId: req.user._id,
      ...req.body,
    });
    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// GET /api/bookings/my
const getMyBookings = async (req, res) => {
  try {
    const { status, search, page, limit } = req.query;
    const result = await bookingService.getUserBookings(req.user._id, { status, search, page, limit });
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/bookings (admin)
const getAllBookings = async (req, res) => {
  try {
    const { status, search, page, limit } = req.query;
    const result = await bookingService.getAllBookings({ status, search, page, limit });
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/bookings/:id/cancel
const cancelBooking = async (req, res) => {
  try {
    const booking = await bookingService.cancelBooking(req.params.id, req.user._id, req.body.reason);
    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// GET /api/bookings/slots/:locationId
const getAvailableSlots = async (req, res) => {
  try {
    const { date } = req.query;
    const slots = await bookingService.getAvailableSlots(req.params.locationId, date);
    res.json({ success: true, data: slots });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createBooking, getMyBookings, getAllBookings, cancelBooking, getAvailableSlots };
