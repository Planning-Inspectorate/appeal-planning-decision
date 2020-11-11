const express = require('express');

const applicationNameController = require('../controllers/application-name');

const router = express.Router();

router.get('/', applicationNameController.getApplicationName);

module.exports = router;
