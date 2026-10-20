const express = require('express');
const router = express.Router();
const robotController = require('../controllers/robotController');
const { requireAuth, requireAdmin } = require('../middleware/auth');

router.get('/', robotController.getRobots);
router.get('/:id', robotController.getRobotById);
router.post('/:id/command', robotController.sendRobotCommand);
router.put('/:id', robotController.updateRobot);
router.post('/', robotController.createRobot);

module.exports = router;
