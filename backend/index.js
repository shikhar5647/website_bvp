const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
 
const app = express();
 
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
 
// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bvp_reports');
    console.log('MongoDB connected successfully');
 
    // Seed default users
    const { seedUsers } = require('./routes/auth');
    await seedUsers();
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};
 
connectDB();
 
// Routes
const { router: authRouter } = require('./routes/auth');
app.use('/api/auth', authRouter);
app.use('/api/reports', require('./routes/reports'));
 
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'BVP Report API is running' });
});
 
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
 
module.exports = app;