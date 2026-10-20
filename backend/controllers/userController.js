const firebaseService = require('../services/firebaseService');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'raw_bot_industrial_secret_key_2026_xyz';

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    let userRole = null;
    let userName = '';
    let userEmail = cleanEmail;
    let userTitle = '';
    let uid = '';

    if (cleanEmail === 'admin@rawbot.io' || cleanEmail === 'boss@rawbot.io') {
      if (cleanPass === 'admin123' || cleanPass === 'Admin@123' || cleanPass === 'password123') {
        userRole = 'ADMIN';
        userName = 'Amol Sawant (Boss)';
        userEmail = 'admin@rawbot.io';
        userTitle = 'System Administrator (Boss)';
        uid = 'USR-001';
      }
    } else if (cleanEmail === 'manager@rawbot.io') {
      if (cleanPass === 'manager123' || cleanPass === 'Manager@123' || cleanPass === 'password123') {
        userRole = 'MANAGER';
        userName = 'Sarah Jenkins';
        userEmail = 'manager@rawbot.io';
        userTitle = 'Operations Manager';
        uid = 'USR-002';
      }
    } else if (cleanEmail === 'staff@rawbot.io' || cleanEmail === 'operator@rawbot.io') {
      if (cleanPass === 'staff123' || cleanPass === 'Staff@123' || cleanPass === 'password123') {
        userRole = 'STAFF';
        userName = 'Vikram Patel';
        userEmail = 'staff@rawbot.io';
        userTitle = 'Warehouse Staff / Robot Operator';
        uid = 'USR-003';
      }
    }

    if (!userRole) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password. Please check your credentials.'
      });
    }

    const token = jwt.sign(
      {
        uid,
        email: userEmail,
        name: userName,
        role: userRole,
        title: userTitle
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Record login in audit logs
    const auditLogs = (await firebaseService.getData('auditLogs')) || [];
    const logList = Array.isArray(auditLogs) ? auditLogs : Object.values(auditLogs);
    const newLog = {
      id: `LOG-${Date.now().toString().slice(-5)}`,
      user: userEmail,
      name: userName,
      role: userRole,
      action: 'LOGIN',
      timestamp: new Date().toISOString(),
      result: 'SUCCESS'
    };
    logList.unshift(newLog);
    await firebaseService.setData('auditLogs', logList.slice(0, 50));

    res.json({
      success: true,
      token,
      user: {
        uid,
        email: userEmail,
        name: userName,
        role: userRole,
        title: userTitle
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getAuditLogs = async (req, res) => {
  try {
    const logs = (await firebaseService.getData('auditLogs')) || [];
    const list = Array.isArray(logs) ? logs : Object.values(logs);
    res.json({ success: true, count: list.length, data: list });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.recordAuditLog = async (req, res) => {
  try {
    const { user, action, result = 'SUCCESS' } = req.body;
    const auditLogs = (await firebaseService.getData('auditLogs')) || [];
    const logList = Array.isArray(auditLogs) ? auditLogs : Object.values(auditLogs);
    const newLog = {
      id: `LOG-${Date.now().toString().slice(-5)}`,
      user: user || req.user?.email || 'unknown',
      role: req.user?.role || 'STAFF',
      action: action || 'ACTION',
      timestamp: new Date().toISOString(),
      result
    };
    logList.unshift(newLog);
    await firebaseService.setData('auditLogs', logList.slice(0, 50));
    res.status(201).json({ success: true, data: newLog });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await firebaseService.getData('users');
    const list = Array.isArray(users) ? users : Object.values(users || {});
    res.json({ success: true, count: list.length, data: list });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { name, email, role, status } = req.body;
    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Name and email are required' });
    }

    const newUser = {
      id: `USR-${Date.now().toString().slice(-3)}`,
      name,
      email,
      role: role || 'EMPLOYEE',
      title: role === 'ADMIN' ? 'Boss / Full Access' : 'Employee / Control Only',
      status: status || 'Active',
      lastLogin: 'Never'
    };

    const users = await firebaseService.getData('users') || [];
    const list = Array.isArray(users) ? users : Object.values(users);
    list.push(newUser);
    await firebaseService.setData('users', list);

    res.status(201).json({ success: true, data: newUser });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const users = await firebaseService.getData('users') || [];
    const list = Array.isArray(users) ? [...users] : Object.values(users);
    const id = req.params.id;
    const idx = list.findIndex(u => u.id === id);

    if (idx === -1) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    list[idx] = { ...list[idx], ...req.body };
    if (req.body.role) {
      list[idx].title = req.body.role === 'ADMIN' ? 'Boss / Full Access' : 'Employee / Control Only';
    }

    await firebaseService.setData('users', list);
    res.json({ success: true, data: list[idx] });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const users = await firebaseService.getData('users') || [];
    let list = Array.isArray(users) ? users : Object.values(users);
    const id = req.params.id;

    list = list.filter(u => u.id !== id);
    await firebaseService.setData('users', list);

    res.json({ success: true, message: `User ${id} deleted successfully` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
