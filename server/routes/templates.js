const express = require('express');
const router = express.Router();
const { celebrate } = require('celebrate');
const templateController = require('../controllers/templateController');
const validation = require('../middleware/validation');
const auth = require('../middleware/auth');

router.get('/', celebrate({ query: validation.query.pagination }), templateController.getAllTemplates);
router.get('/:id', templateController.getTemplateById);
router.post('/:templateId/landings', auth.authenticateToken, celebrate({ body: validation.landing.body }), templateController.createLanding);

module.exports = router;