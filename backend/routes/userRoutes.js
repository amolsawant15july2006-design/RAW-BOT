const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { requireAdmin } = require('../middleware/auth');

router.post('/login', userController.login);
router.get('/audit-logs', userController.getAuditLogs);
router.post('/audit-logs', userController.recordAuditLog);
router.get('/', userController.getUsers);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
