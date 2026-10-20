const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');

dotenv.config();

const { isReal } = require('./config/firebase');

// Route Imports
const robotRoutes = require('./routes/robotRoutes');
const packageRoutes = require('./routes/packageRoutes');
const taskRoutes = require('./routes/taskRoutes');
const locationRoutes = require('./routes/locationRoutes');
const alertRoutes = require('./routes/alertRoutes');
const settingRoutes = require('./routes/settingRoutes');
const userRoutes = require('./routes/userRoutes');
const simulationRoutes = require('./routes/simulationRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// System Health & Diagnostics API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    system: 'RAW BOT — Autonomous Warehouse Robot Backend',
    timestamp: new Date().toISOString(),
    firebaseConnected: isReal,
    databaseMode: isReal ? 'FIREBASE_REALTIME_DATABASE' : 'LOCAL_REALTIME_SIMULATOR',
    version: '1.0.0'
  });
});

// Mount Routes
app.use('/api/robots', robotRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/location', locationRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/users', userRoutes);
app.use('/api/simulation', simulationRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

app.listen(PORT, () => {
  console.log('================================================================');
  console.log(`🤖 RAW BOT Industrial Backend running on port ${PORT}`);
  console.log(`🌐 System URL: http://localhost:${PORT}/api/health`);
  console.log(`🔥 Firebase Mode: ${isReal ? 'LIVE FIREBASE CLOUD' : 'STANDALONE REALTIME SIMULATOR'}`);
  console.log('================================================================');
});
