const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { submitQuestionnaire, getLatestAnalysis, getHistory, getAnalysisById } = require('../controllers/analysisController');

router.post('/questionnaire', protect, submitQuestionnaire);
router.get('/latest', protect, getLatestAnalysis);
router.get('/history', protect, getHistory);
router.get('/:id', protect, getAnalysisById);

module.exports = router;
