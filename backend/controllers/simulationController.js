const simulationService = require('../services/simulationService');

exports.getStatus = (req, res) => {
  res.json({
    success: true,
    data: {
      isRunning: simulationService.isRunning,
      speed: simulationService.speed
    }
  });
};

exports.toggle = (req, res) => {
  if (simulationService.isRunning) {
    simulationService.stop();
  } else {
    simulationService.start();
  }
  res.json({
    success: true,
    isRunning: simulationService.isRunning,
    message: simulationService.isRunning ? 'Simulation resumed' : 'Simulation paused'
  });
};

exports.setSpeed = (req, res) => {
  const { speed } = req.body;
  simulationService.setSpeed(parseFloat(speed) || 1.0);
  res.json({
    success: true,
    speed: simulationService.speed,
    message: `Simulation speed set to ${simulationService.speed}x`
  });
};

exports.triggerObstacle = async (req, res) => {
  const { robotId } = req.body;
  const result = await simulationService.triggerObstacle(robotId || 'RBT-01');
  res.json(result);
};
