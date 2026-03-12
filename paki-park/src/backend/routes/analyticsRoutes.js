const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/adminAuth');
const { getDashboardStats, getRevenueData, getOccupancyData, getVehicleTypeDistribution } = require('../controllers/analyticsController');

router.get('/dashboard', protect, adminOnly, getDashboardStats);
router.get('/revenue', protect, adminOnly, getRevenueData);
router.get('/occupancy', protect, adminOnly, getOccupancyData);
router.get('/vehicle-types', protect, adminOnly, getVehicleTypeDistribution);

module.exports = router;
