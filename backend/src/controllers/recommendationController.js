const SkinAnalysis = require('../models/SkinAnalysis');
const { generateRecommendation } = require('../rules/recommendationEngine');

exports.generateUserRecommendation = async (req, res) => {
  try {
    const analysis = await SkinAnalysis.findOne({ userId: req.user.id }).sort({ completedAt: -1 });
    
    if (!analysis) {
      return res.status(404).json({ message: 'No skin analysis found. Please complete the questionnaire first.' });
    }

    const recommendation = generateRecommendation({
      skinType: analysis.skinType,
      sensitivity: analysis.sensitivity,
      concerns: analysis.concerns
    });

    res.status(200).json(recommendation);
  } catch (error) {
    console.error('Recommendation generation error:', error);
    res.status(500).json({ message: 'Server error generating recommendation.' });
  }
};
