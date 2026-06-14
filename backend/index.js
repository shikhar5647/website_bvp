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

// Connect to MongoDB and seed users — returns a promise
let dbReady = null;
const connectDB = () => {
  if (dbReady) return dbReady;
  dbReady = (async () => {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bvp_reports');
    console.log('MongoDB connected successfully');
    // Seed default users (errors are non-fatal)
    const { seedUsers } = require('./routes/auth');
    try { await seedUsers(); } catch (e) { console.error('Seed warning:', e.message); }
  })();
  return dbReady;
};

// Middleware: wait for DB + seeding to finish before handling any request
app.use(async (req, res, next) => {
  try { await connectDB(); next(); }
  catch (err) { res.status(503).json({ success: false, message: 'Database unavailable' }); }
});

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
