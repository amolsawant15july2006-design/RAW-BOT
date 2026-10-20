const firebaseService = require('../services/firebaseService');

exports.getAlerts = async (req, res) => {
  try {
    const alerts = await firebaseService.getData('alerts');
    let list = Array.isArray(alerts) ? alerts : Object.values(alerts || {});
    const { type, status } = req.query;

    if (type && type !== 'All') {
      list = list.filter(a => a.type && a.type.toLowerCase() === type.toLowerCase());
    }
    if (status) {
      list = list.filter(a => a.status && a.status.toLowerCase() === status.toLowerCase());
    }

    // Sort descending by time
    list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    res.json({ success: true, count: list.length, data: list });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createAlert = async (req, res) => {
  try {
    const { type, message, robotId } = req.body;
    const newAlert = {
      id: `ALT-${Date.now().toString().slice(-4)}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: type || 'Info',
      message: message || 'System event',
      robotId: robotId || 'SYSTEM',
      status: 'Unread',
      createdAt: new Date().toISOString()
    };
    await firebaseService.pushData('alerts', newAlert);
    res.status(201).json({ success: true, data: newAlert });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateAlert = async (req, res) => {
  try {
    const alerts = await firebaseService.getData('alerts');
    const id = req.params.id;

    if (Array.isArray(alerts)) {
      const idx = alerts.findIndex(a => a.id === id);
      if (idx !== -1) {
        alerts[idx] = { ...alerts[idx], ...req.body };
        await firebaseService.setData('alerts', alerts);
        return res.json({ success: true, data: alerts[idx] });
      }
    } else if (alerts && typeof alerts === 'object') {
      if (alerts[id]) {
        alerts[id] = { ...alerts[id], ...req.body };
        await firebaseService.setData('alerts', alerts);
        return res.json({ success: true, data: alerts[id] });
      }
    }

    res.status(404).json({ success: false, message: 'Alert not found' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.clearAlerts = async (req, res) => {
  try {
    await firebaseService.setData('alerts', []);
    res.json({ success: true, message: 'All alerts cleared' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
