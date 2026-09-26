const SkinAnalysis = require('../models/SkinAnalysis');
const PhotoAnalysis = require('../models/PhotoAnalysis');

exports.getSkinJourney = async (req, res) => {
  try {
    const userId = req.user.id;

    // Run queries in parallel for efficiency
    const [latestSkinAnalysis, latestPhotoAnalysis, assessmentHistory, photoHistory] = await Promise.all([
      SkinAnalysis.findOne({ userId }).sort({ completedAt: -1 }),
      PhotoAnalysis.findOne({ userId }).sort({ analyzedAt: -1 }),
      SkinAnalysis.find({ userId }).select('-answers').sort({ completedAt: -1 }).limit(20),
      PhotoAnalysis.find({ userId }).sort({ analyzedAt: -1 }).limit(20)
    ]);

    res.status(200).json({
      latestSkinAnalysis,
      latestPhotoAnalysis,
      assessmentHistory,
      photoHistory
    });

  } catch (error) {
    console.error('Fetch skin journey error:', error);
    res.status(500).json({ message: 'Server error fetching skin journey.' });
  }
};
