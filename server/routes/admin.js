const express = require('express');
const router = express.Router();
const { celebrate } = require('celebrate');
const adminController = require('../controllers/adminController');
const validation = require('../middleware/validation');
const auth = require('../middleware/auth');

// Все роуты требуют аутентификации и прав администратора
router.use(auth.authenticateToken, auth.requireAdmin);

router.get('/landings', celebrate({ query: validation.query.pagination }), adminController.getAllLandings);
router.get('/stats', adminController.getDashboardStats);
router.delete('/landings/:id', adminController.deleteLanding);

module.exports = router;