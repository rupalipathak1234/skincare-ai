const SkinAnalysis = require('../models/SkinAnalysis');
const { calculateSkinProfile } = require('../rules/scoringEngine');

exports.submitQuestionnaire = async (req, res) => {
  try {
    const { answers } = req.body;
    
    if (!answers || Object.keys(answers).length < 10) {
      return res.status(400).json({ message: 'All 10 questions must be answered.' });
    }

    const profile = calculateSkinProfile(answers);

    const analysis = await SkinAnalysis.create({
      userId: req.user.id,
      answers: answers,
      skinType: profile.skinType,
      sensitivity: profile.sensitivity,
      concerns: profile.concerns,
      scores: profile.scores
    });

    res.status(201).json(analysis);
  } catch (error) {
    console.error('Questionnaire error:', error);
    res.status(500).json({ message: 'Server error calculating profile.' });
  }
};

exports.getLatestAnalysis = async (req, res) => {
  try {
    const analysis = await SkinAnalysis.findOne({ userId: req.user.id }).sort({ completedAt: -1 });
    
    if (!analysis) {
      return res.status(404).json({ message: 'No analysis found.' });
    }

    res.status(200).json(analysis);
  } catch (error) {
    console.error('Fetch analysis error:', error);
    res.status(500).json({ message: 'Server error fetching analysis.' });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const history = await SkinAnalysis.find({ userId: req.user.id })
      .select('-answers') // Optionally exclude answers to save bandwidth if not needed
      .sort({ completedAt: -1 })
      .limit(20);
    
    res.status(200).json(history);
  } catch (error) {
    console.error('Fetch analysis history error:', error);
    res.status(500).json({ message: 'Server error fetching analysis history.' });
  }
};

exports.getAnalysisById = async (req, res) => {
  try {
    const analysis = await SkinAnalysis.findOne({ _id: req.params.id, userId: req.user.id });
    
    if (!analysis) {
      return res.status(404).json({ message: 'Analysis not found' });
    }

    res.status(200).json(analysis);
  } catch (error) {
    console.error('Fetch analysis by ID error:', error);
    res.status(500).json({ message: 'Server error fetching analysis.' });
  }
};
