const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/adminAuth');
const { createBooking, getMyBookings, getAllBookings, cancelBooking, getAvailableSlots } = require('../controllers/bookingController');

// Customer routes
router.post('/', protect, createBooking);
router.get('/my', protect, getMyBookings);
router.patch('/:id/cancel', protect, cancelBooking);
router.get('/slots/:locationId', protect, getAvailableSlots);

// Admin routes
router.get('/', protect, adminOnly, getAllBookings);

module.exports = router;
