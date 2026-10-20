const firebaseService = require('../services/firebaseService');

exports.getLocations = async (req, res) => {
  try {
    const locations = await firebaseService.getData('locations');
    res.json({ success: true, data: locations || {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getLocationByRobot = async (req, res) => {
  try {
    const robot = await firebaseService.getData(`robots/${req.params.robotId}`);
    if (!robot) {
      return res.status(404).json({ success: false, message: 'Robot not found' });
    }
    const locations = await firebaseService.getData('locations');
    const locNode = locations ? locations[robot.currentLocation] : null;

    res.json({
      success: true,
      robotId: req.params.robotId,
      currentLocation: robot.currentLocation,
      destination: robot.destination,
      coordinates: locNode ? { x: locNode.x, y: locNode.y } : null
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
