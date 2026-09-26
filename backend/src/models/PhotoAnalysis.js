const mongoose = require('mongoose');

const photoAnalysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  imageQuality: {
    usable: Boolean,
    brightness: String,
    sharpness: String
  },
  faceDetected: Boolean,
  observations: [
    {
      type: { type: String },
      level: String,
      description: String
    }
  ],
  message: String,
  analyzedAt: {
    type: Date,
    default: Date.now,
  }
});

// Indexes for optimized querying
photoAnalysisSchema.index({ userId: 1, analyzedAt: -1 });

module.exports = mongoose.model('PhotoAnalysis', photoAnalysisSchema);
