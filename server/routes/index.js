const express = require('express');
const authRoutes = require('./auth');
const templateRoutes = require('./templates');
const adminRoutes = require('./admin');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/templates', templateRoutes);
router.use('/admin', adminRoutes);

module.exports = router;