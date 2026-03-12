const Settings = require('../models/Settings');
const ParkingRate = require('../models/ParkingRate');
const User = require('../models/User');

// GET /api/settings/:category
const getSettings = async (req, res) => {
  try {
    const settings = await Settings.find({ category: req.params.category });
    const result = {};
    settings.forEach((s) => { result[s.key] = s.value; });
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/settings/:category
const updateSettings = async (req, res) => {
  try {
    const { category } = req.params;
    const updates = req.body;

    for (const [key, value] of Object.entries(updates)) {
      await Settings.findOneAndUpdate(
        { key, category },
        { key, value, category },
        { upsert: true, new: true }
      );
    }

    res.json({ success: true, message: 'Settings updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/settings/parking-rates
const getParkingRates = async (req, res) => {
  try {
    const rates = await ParkingRate.find().sort({ vehicleType: 1 });
    res.json({ success: true, data: rates });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/settings/parking-rates/:id
const updateParkingRate = async (req, res) => {
  try {
    const rate = await ParkingRate.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!rate) return res.status(404).json({ success: false, message: 'Rate not found' });
    res.json({ success: true, data: rate });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// GET /api/settings/admin-users
const getAdminUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'admin' }).select('-password');
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getSettings, updateSettings, getParkingRates, updateParkingRate, getAdminUsers };
