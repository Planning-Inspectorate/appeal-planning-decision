const express = require('express');

const confirmationController = require('../controllers/confirmation');
const fetchExistingAppealMiddleware = require('../middleware/fetch-existing-appeal');

const router = express.Router();

router.get('/', [fetchExistingAppealMiddleware], confirmationController.getConfirmation);

module.exports = router;
