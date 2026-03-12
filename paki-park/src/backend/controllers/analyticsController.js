const Booking = require('../models/Booking');
const User = require('../models/User');
const Location = require('../models/Location');

// GET /api/analytics/dashboard
const getDashboardStats = async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const activeUsers = await User.countDocuments({ role: 'customer' });
    const totalLocations = await Location.countDocuments({ status: 'active' });
    const totalSpots = await Location.aggregate([{ $group: { _id: null, total: { $sum: '$totalSpots' } } }]);

    const revenueResult = await Booking.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    res.json({
      success: true,
      data: {
        totalBookings,
        activeUsers,
        parkingSpots: totalSpots[0]?.total || 0,
        totalLocations,
        revenue: revenueResult[0]?.total || 0,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/analytics/revenue
const getRevenueData = async (req, res) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const revenueData = await Booking.aggregate([
      { $match: { paymentStatus: 'paid', createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          revenue: { $sum: '$amount' },
          bookings: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({ success: true, data: revenueData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/analytics/occupancy
const getOccupancyData = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const occupancyData = await Booking.aggregate([
      { $match: { date: today, status: { $in: ['upcoming', 'active'] } } },
      {
        $group: {
          _id: '$timeSlot',
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({ success: true, data: occupancyData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/analytics/vehicle-types
const getVehicleTypeDistribution = async (req, res) => {
  try {
    const data = await Booking.aggregate([
      {
        $lookup: {
          from: 'vehicles',
          localField: 'vehicleId',
          foreignField: '_id',
          as: 'vehicle',
        },
      },
      { $unwind: '$vehicle' },
      { $group: { _id: '$vehicle.type', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getDashboardStats, getRevenueData, getOccupancyData, getVehicleTypeDistribution };
