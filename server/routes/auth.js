const express = require('express');
const router = express.Router();
const { celebrate } = require('celebrate');
const authController = require('../controllers/authController');
const validation = require('../middleware/validation');
const auth = require('../middleware/auth');

router.post('/login', celebrate({ body: validation.login.body }), authController.login);
router.get('/me', auth.authenticateToken, authController.getMe);

module.exports = router;