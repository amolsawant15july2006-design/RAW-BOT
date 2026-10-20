const robotService = require('../services/robotService');

exports.getRobots = async (req, res) => {
  try {
    const robots = await robotService.getAllRobots();
    res.json({ success: true, count: robots.length, data: robots });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getRobotById = async (req, res) => {
  try {
    const robot = await robotService.getRobotById(req.params.id);
    if (!robot) {
      return res.status(404).json({ success: false, message: 'Robot not found' });
    }
    res.json({ success: true, data: robot });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.sendRobotCommand = async (req, res) => {
  try {
    const { command, destination, currentTask, taskId, packageId } = req.body;
    if (!command) {
      return res.status(400).json({ success: false, message: 'Command is required' });
    }

    const updatedRobot = await robotService.executeCommand(req.params.id, command, {
      destination,
      currentTask,
      taskId,
      packageId
    });

    res.json({
      success: true,
      message: `Command ${command} sent to ${req.params.id} successfully`,
      data: updatedRobot
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateRobot = async (req, res) => {
  try {
    const updated = await robotService.updateRobot(req.params.id, req.body);
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.createRobot = async (req, res) => {
  try {
    const newRobot = await robotService.addRobot(req.body);
    res.status(201).json({ success: true, data: newRobot });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
