const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { generateToken, authMiddleware, requireRole } = require('../middleware/auth');
const { BRANCH_NAMES, PRANT_NAME } = require('backend/config/branches');
const fs = require('fs');
const path = require('path');
 
const CSV_PATH = path.join(__dirname, '..', 'data', 'users.csv');
 
// Ensure data directory exists
function ensureDataDir() {
  const dir = path.dirname(CSV_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}
 
// Write all users to CSV
async function exportUsersToCSV() {
  ensureDataDir();
  const users = await User.find().select('-__v').lean();
  const header = 'Username,Role,Branch,District,Approved,Created At\n';
  const rows = users.map(u =>
    `"${u.username}","${u.role}","${u.branchName || ''}","${u.districtName || ''}","${u.approved}","${new Date(u.createdAt).toLocaleDateString('en-IN')}"`
  ).join('\n');
  fs.writeFileSync(CSV_PATH, header + rows, 'utf8');
}
 
// Seed default admin + branch secretaries on first run
async function seedUsers() {
  const count = await User.countDocuments();
  if (count > 0) return;
 
  // Create admin
  await User.create({
    username: 'admin',
    password: '1234',
    role: 'admin',
    branchName: '',
    districtName: '',
    approved: true,
  });
 
  // Create Prant Secretary
  await User.create({
    username: 'secretary_prant',
    password: '1234',
    role: 'prant_secretary',
    branchName: '',
    districtName: '',
    approved: true,
  });
 
  // Create one secretary per branch
  for (const branch of BRANCH_NAMES) {
    const username = 'secretary_' + branch.toLowerCase().replace(/\s+/g, '_');
    await User.create({
      username,
      password: '1234',
      role: 'branch_secretary',
      branchName: branch,
      districtName: '',
      approved: true,
    });
  }
 
  await exportUsersToCSV();
  console.log(`Seeded ${BRANCH_NAMES.length + 2} users (admin + prant + ${BRANCH_NAMES.length} branches)`);
}
 
// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password required' });
    }
 
    const user = await User.findOne({ username: username.trim().toLowerCase() });
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });
 
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });
 
    if (!user.approved) {
      return res.status(403).json({ success: false, message: 'Account pending admin approval' });
    }
 
    const token = generateToken(user);
    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          username: user.username,
          role: user.role,
          branchName: user.branchName,
          districtName: user.districtName,
        },
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
 
// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { username, password, role, branchName, districtName } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password required' });
    }
 
    const existing = await User.findOne({ username: username.trim().toLowerCase() });
    if (existing) return res.status(400).json({ success: false, message: 'Username already exists' });
 
    const user = await User.create({
      username: username.trim().toLowerCase(),
      password,
      role: role || 'branch_secretary',
      branchName: branchName || '',
      districtName: districtName || '',
      approved: false, // new registrations need admin approval
    });
 
    await exportUsersToCSV();
    res.status(201).json({
      success: true,
      message: 'Registration successful. Awaiting admin approval.',
      data: { username: user.username, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
 
// PUT /api/auth/change-password
router.put('/change-password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Both passwords required' });
    }
 
    const user = await User.findById(req.user._id);
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Current password incorrect' });
 
    user.password = newPassword;
    await user.save();
    await exportUsersToCSV();
 
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
 
// GET /api/auth/me
router.get('/me', authMiddleware, async (req, res) => {
  res.json({ success: true, data: req.user });
});
 
// GET /api/auth/users — admin only
router.get('/users', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password -__v').sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
 
// PUT /api/auth/users/:id/approve — admin only
router.put('/users/:id/approve', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { approved: true }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    await exportUsersToCSV();
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
 
// DELETE /api/auth/users/:id — admin only
router.delete('/users/:id', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    await exportUsersToCSV();
    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
 
// GET /api/auth/users/csv — admin only, download CSV
router.get('/users/csv', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    await exportUsersToCSV();
    res.download(CSV_PATH, 'bvp_users.csv');
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
 
module.exports = { router, seedUsers };
 