const firebaseService = require('../services/firebaseService');

exports.getSettings = async (req, res) => {
  try {
    const settings = await firebaseService.getData('settings');
    res.json({ success: true, data: settings || {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const section = req.params.section; // general, robot, notifications, system
    if (section) {
      await firebaseService.updateData(`settings/${section}`, req.body);
    } else {
      await firebaseService.updateData('settings', req.body);
    }
    const current = await firebaseService.getData('settings');
    res.json({ success: true, message: 'Settings updated successfully', data: current });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
