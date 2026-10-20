const jwt = require('jsonwebtoken');
const { admin, isReal } = require('../config/firebase');

const JWT_SECRET = process.env.JWT_SECRET || 'raw_bot_industrial_secret_key_2026_xyz';

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No authentication token provided.'
    });
  }

  const token = authHeader.split(' ')[1];

  // 1. Support quick demo tokens for offline/academic review
  if (token === 'DEMO_ADMIN_TOKEN') {
    req.user = {
      uid: 'USR-001',
      name: 'Amol Sawant',
      email: 'admin@rawbot.io',
      role: 'ADMIN',
      title: 'System Administrator'
    };
    return next();
  }

  if (token === 'DEMO_MANAGER_TOKEN') {
    req.user = {
      uid: 'USR-002',
      name: 'Operations Manager',
      email: 'manager@rawbot.io',
      role: 'MANAGER',
      title: 'Operations Manager / Reports & Monitoring'
    };
    return next();
  }

  if (token === 'DEMO_STAFF_TOKEN' || token === 'DEMO_EMPLOYEE_TOKEN') {
    req.user = {
      uid: 'USR-003',
      name: 'Robot Operator Staff',
      email: 'staff@rawbot.io',
      role: 'STAFF',
      title: 'Warehouse Staff / Robot Operator'
    };
    return next();
  }

  // 2. Real Firebase ID token verification if Firebase is connected
  if (isReal && admin) {
    try {
      const decoded = await admin.auth().verifyIdToken(token);
      req.user = {
        uid: decoded.uid,
        email: decoded.email,
        name: decoded.name || decoded.email.split('@')[0],
        role: decoded.admin ? 'ADMIN' : (decoded.role || 'EMPLOYEE'),
        title: decoded.admin ? 'Boss / Full Access' : 'Employee / Control Only'
      };
      return next();
    } catch (firebaseErr) {
      // Fall through to JWT check if Firebase token verification fails
    }
  }

  // 3. Standard JWT verification
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token.'
    });
  }
};

const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden. Action requires role: ${allowedRoles.join(' or ')}. Your role is: ${req.user.role}`
      });
    }

    next();
  };
};

module.exports = {
  verifyToken,
  requireAuth: verifyToken,
  requireAdmin: [verifyToken, requireRole(['ADMIN'])],
  requireManager: [verifyToken, requireRole(['ADMIN', 'MANAGER'])],
  requireStaff: [verifyToken, requireRole(['ADMIN', 'STAFF', 'EMPLOYEE'])],
  requireEmployee: [verifyToken, requireRole(['ADMIN', 'MANAGER', 'STAFF', 'EMPLOYEE'])]
};
