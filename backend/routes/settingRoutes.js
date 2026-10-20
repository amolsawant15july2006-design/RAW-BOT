const express = require('express');
const router = express.Router();
const settingController = require('../controllers/settingController');
const { requireAdmin } = require('../middleware/auth');

router.get('/', settingController.getSettings);
router.put('/', settingController.updateSettings);
router.put('/:section', settingController.updateSettings);

module.exports = router;
