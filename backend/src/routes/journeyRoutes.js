const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { getSkinJourney } = require('../controllers/journeyController');

router.get('/', protect, getSkinJourney);

module.exports = router;
