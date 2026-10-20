const express = require('express');
const router = express.Router();
const simulationController = require('../controllers/simulationController');

router.get('/status', simulationController.getStatus);
router.post('/toggle', simulationController.toggle);
router.post('/speed', simulationController.setSpeed);
router.post('/obstacle', simulationController.triggerObstacle);

module.exports = router;
