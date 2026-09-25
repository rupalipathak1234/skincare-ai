require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

const app = express();

// Middleware
app.use(cors({
  origin: true, // Dynamically allows the requesting origin (e.g. localhost:5173, 127.0.0.1:5173)
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Database connection (uncomment when MongoDB URI is set)
if (process.env.MONGO_URI) {
  connectDB();
} else {
  console.log('Skipping MongoDB connection (MONGO_URI not set)');
}

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/skin-analysis', require('./routes/analysisRoutes'));
app.use('/api/recommendations', require('./routes/recommendationRoutes'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'backend', timestamp: new Date() });
});

// Basic Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!', message: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
