const mongoose = require('mongoose');

const skinAnalysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  answers: {
    type: Object,
    required: true,
  },
  skinType: {
    type: String,
    required: true,
  },
  sensitivity: {
    type: String,
    required: true,
  },
  concerns: {
    type: [String],
    default: [],
  },
  scores: {
    type: Object,
    required: true,
  },
  completedAt: {
    type: Date,
    default: Date.now,
  }
});

skinAnalysisSchema.index({ userId: 1, completedAt: -1 });

module.exports = mongoose.model('SkinAnalysis', skinAnalysisSchema);
