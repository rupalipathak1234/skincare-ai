const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { generateUserRecommendation } = require('../controllers/recommendationController');

// For MVP, POST and GET behave similarly as they both fetch the latest profile and generate dynamically.
router.post('/generate', protect, generateUserRecommendation);
router.get('/latest', protect, generateUserRecommendation);

module.exports = router;
