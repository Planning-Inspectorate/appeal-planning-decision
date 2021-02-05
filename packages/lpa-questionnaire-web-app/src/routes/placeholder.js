const express = require('express');
const fetchAppealMiddleware = require('../middleware/fetch-appeal');
const placeholderController = require('../controllers/placeholder');

const router = express.Router();

router.get('/:id/placeholder', [fetchAppealMiddleware], placeholderController.getPlaceholder);

module.exports = router;
