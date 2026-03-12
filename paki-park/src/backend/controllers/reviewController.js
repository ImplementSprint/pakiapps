const Review = require('../models/Review');

// POST /api/reviews
const createReview = async (req, res) => {
  try {
    const review = await Review.create({
      userId: req.user._id,
      ...req.body,
    });
    res.status(201).json({ success: true, data: review });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// GET /api/reviews
const getReviews = async (req, res) => {
  try {
    const { locationId, page = 1, limit = 20 } = req.query;
    const query = {};
    if (locationId) query.locationId = locationId;

    const reviews = await Review.find(query)
      .populate('userId', 'name profilePicture')
      .populate('locationId', 'name')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Review.countDocuments(query);

    res.json({ success: true, data: { reviews, total, page, totalPages: Math.ceil(total / limit) } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/reviews/stats
const getReviewStats = async (req, res) => {
  try {
    const stats = await Review.aggregate([
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
          fiveStars: { $sum: { $cond: [{ $eq: ['$rating', 5] }, 1, 0] } },
          fourStars: { $sum: { $cond: [{ $eq: ['$rating', 4] }, 1, 0] } },
          threeStars: { $sum: { $cond: [{ $eq: ['$rating', 3] }, 1, 0] } },
          twoStars: { $sum: { $cond: [{ $eq: ['$rating', 2] }, 1, 0] } },
          oneStar: { $sum: { $cond: [{ $eq: ['$rating', 1] }, 1, 0] } },
        },
      },
    ]);

    res.json({ success: true, data: stats[0] || { averageRating: 0, totalReviews: 0 } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createReview, getReviews, getReviewStats };
