const express = require('express');

const confirmationController = require('../../controllers/appellant-submission/confirmation');
const fetchExistingAppealMiddleware = require('../../middleware/fetch-existing-appeal');

const router = express.Router();

router.get(
	'/confirmation',
	[fetchExistingAppealMiddleware],
	confirmationController.getConfirmation
);

module.exports = router;
