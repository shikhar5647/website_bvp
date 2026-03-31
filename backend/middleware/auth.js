const jwt = require('jsonwebtoken');
const User = require('../models/User');
 
const JWT_SECRET = process.env.JWT_SECRET || 'bvp_report_secret_2026';
 
function generateToken(user) {
  return jwt.sign(
    { id: user._id, username: user.username, role: user.role, branchName: user.branchName },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}
 
async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }
 
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ success: false, message: 'User not found' });
    if (!user.approved) return res.status(403).json({ success: false, message: 'Account pending approval' });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
}
 
function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Insufficient permissions' });
    }
    next();
  };
}
 
module.exports = { generateToken, authMiddleware, requireRole, JWT_SECRET };
