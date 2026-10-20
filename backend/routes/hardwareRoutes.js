const express = require('express');
const router = express.Router();
const http = require('http');

// Default ESP32 IP (AP mode is 192.168.4.1; Station mode is configurable)
let esp32Config = {
  ip: '192.168.4.1',
  port: 80,
  connected: false,
  lastDistances: { front: null, back: null, left: null, right: null },
  lastSeen: null
};

// Helper: HTTP request to ESP32 with short timeout
function callEsp32(path, method = 'GET', timeout = 1500) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: esp32Config.ip,
      port: esp32Config.port,
      path: path,
      method: method,
      timeout: timeout
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, data });
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('ESP32 Connection Timeout'));
    });

    req.end();
  });
}

// 1. Get current bridge status & configuration
router.get('/status', async (req, res) => {
  try {
    const result = await callEsp32('/distances', 'GET', 1200);
    esp32Config.connected = (result.statusCode === 200);
    esp32Config.lastSeen = new Date().toISOString();
    try {
      esp32Config.lastDistances = JSON.parse(result.data);
    } catch (e) {}

    res.json({
      success: true,
      bridge: 'ONLINE',
      esp32Ip: esp32Config.ip,
      distances: esp32Config.lastDistances,
      lastSeen: esp32Config.lastSeen
    });
  } catch (error) {
    esp32Config.connected = false;
    res.json({
      success: false,
      bridge: 'OFFLINE',
      esp32Ip: esp32Config.ip,
      message: `Cannot reach ESP32 at http://${esp32Config.ip}. Ensure ESP32 is powered on and connected to the same network.`,
      distances: esp32Config.lastDistances
    });
  }
});

// 2. Set ESP32 IP configuration
router.post('/config', (req, res) => {
  const { ip, port } = req.body;
  if (ip) esp32Config.ip = ip.trim();
  if (port) esp32Config.port = Number(port);

  res.json({
    success: true,
    message: `ESP32 target address updated to http://${esp32Config.ip}:${esp32Config.port}`,
    config: esp32Config
  });
});

// 3. Send movement command to ESP32 (dir: F, B, L, R, A, C, S)
router.post('/move', async (req, res) => {
  const { dir } = req.body;
  if (!dir) {
    return res.status(400).json({ success: false, message: 'Direction parameter (dir) is required' });
  }

  const validDirs = ['F', 'B', 'L', 'R', 'A', 'C', 'S'];
  const cleanDir = dir.toUpperCase();
  if (!validDirs.includes(cleanDir)) {
    return res.status(400).json({ success: false, message: `Invalid direction: ${dir}. Valid: ${validDirs.join(', ')}` });
  }

  try {
    const result = await callEsp32(`/move?dir=${cleanDir}`, 'GET', 1200);
    res.status(result.statusCode).json({
      success: result.statusCode === 200,
      dir: cleanDir,
      response: result.data
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      message: `Failed to send command to ESP32: ${error.message}`
    });
  }
});

// 4. Trigger Emergency Stop on ESP32
router.post('/emergency', async (req, res) => {
  try {
    const result = await callEsp32('/emergency', 'GET', 1200);
    res.json({
      success: true,
      message: 'Emergency Stop sent to ESP32',
      response: result.data
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      message: `Failed to trigger Emergency Stop on ESP32: ${error.message}`
    });
  }
});

// 5. Read ultrasonic distances from ESP32
router.get('/distances', async (req, res) => {
  try {
    const result = await callEsp32('/distances', 'GET', 1000);
    const parsed = JSON.parse(result.data);
    esp32Config.lastDistances = parsed;
    esp32Config.connected = true;
    res.json({
      success: true,
      data: parsed
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      message: error.message,
      lastKnown: esp32Config.lastDistances
    });
  }
});

// 6. Heartbeat keepalive
router.get('/heartbeat', async (req, res) => {
  try {
    const result = await callEsp32('/heartbeat', 'GET', 800);
    res.status(result.statusCode).json({
      success: result.statusCode === 200,
      response: result.data
    });
  } catch (error) {
    res.status(503).json({ success: false, message: error.message });
  }
});

module.exports = router;
