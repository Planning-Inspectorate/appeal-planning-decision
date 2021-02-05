const express = require('express');
const placeholderController = require('../controllers/placeholder');

const router = express.Router();

router.get('/placeholder', placeholderController.getPlaceholder);

module.exports = router;
