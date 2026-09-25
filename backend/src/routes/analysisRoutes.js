const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { submitQuestionnaire, getLatestAnalysis } = require('../controllers/analysisController');

router.post('/questionnaire', protect, submitQuestionnaire);
router.get('/latest', protect, getLatestAnalysis);

module.exports = router;
