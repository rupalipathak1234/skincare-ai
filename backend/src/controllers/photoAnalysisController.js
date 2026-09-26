const multer = require('multer');
const PhotoAnalysis = require('../models/PhotoAnalysis');


// Configure multer for memory storage (we don't save the image locally)
const storage = multer.memoryStorage();

// Accept only standard image types and limit to 5MB
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG and PNG are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: fileFilter
});

exports.uploadMiddleware = upload.single('image');

exports.analyzePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file uploaded.' });
    }

    const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';

    // Construct FormData for native fetch
    const formData = new FormData();
    const blob = new Blob([req.file.buffer], { type: req.file.mimetype });
    formData.append('file', blob, req.file.originalname);

    try {
      const aiResponse = await fetch(`${aiServiceUrl}/analyze`, {
        method: 'POST',
        body: formData
      });

      if (!aiResponse.ok) {
        const errorData = await aiResponse.json().catch(() => ({}));
        console.error('AI Service Error:', aiResponse.status, errorData);
        return res.status(502).json({ 
          message: 'Error communicating with AI analysis service.',
          details: errorData.detail || 'Unknown AI service error'
        });
      }

      const data = await aiResponse.json();

      // Save to MongoDB
      const analysisRecord = await PhotoAnalysis.create({
        userId: req.user.id,
        imageQuality: data.imageQuality,
        faceDetected: data.faceDetected,
        observations: data.observations,
        message: data.message
      });

      // Send the structured response along with the generated DB ID
      return res.status(200).json({
        id: analysisRecord._id,
        ...data
      });
    } catch (fetchError) {
      console.error('Fetch to AI service failed:', fetchError);
      return res.status(503).json({ message: 'AI service is currently unavailable.' });
    }

  } catch (error) {
    console.error('Photo analysis error:', error);
    res.status(500).json({ message: 'Server error processing the image.' });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const history = await PhotoAnalysis.find({ userId: req.user.id })
      .sort({ analyzedAt: -1 })
      .limit(20);
    
    res.status(200).json(history);
  } catch (error) {
    console.error('Fetch photo analysis history error:', error);
    res.status(500).json({ message: 'Server error fetching photo analysis history.' });
  }
};

exports.getAnalysisById = async (req, res) => {
  try {
    const analysis = await PhotoAnalysis.findOne({ _id: req.params.id, userId: req.user.id });
    
    if (!analysis) {
      return res.status(404).json({ message: 'Photo analysis not found' });
    }

    res.status(200).json(analysis);
  } catch (error) {
    console.error('Fetch photo analysis by ID error:', error);
    res.status(500).json({ message: 'Server error fetching photo analysis.' });
  }
};
