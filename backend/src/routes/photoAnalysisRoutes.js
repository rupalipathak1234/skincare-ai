const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { analyzePhoto, uploadMiddleware } = require('../controllers/photoAnalysisController');

router.post('/analyze', protect, (req, res, next) => {
  uploadMiddleware(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  });
}, analyzePhoto);

module.exports = router;
