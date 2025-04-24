const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getAccessoryRecommendations,GETfriendChatAi } = require('../controllers/recommendationController');

// @route   POST /api/recommendations
// @desc    Get accessory recommendations
// @access  Private
router.post('/recommend', protect, getAccessoryRecommendations);
router.post('/friendrecommendation', protect, GETfriendChatAi );
module.exports = router; 