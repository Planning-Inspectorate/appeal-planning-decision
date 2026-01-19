const express = require('express');
const canUseService = require('../../controllers/before-you-start/can-use-service');
const fetchExistingAppealMiddleware = require('../../middleware/fetch-existing-appeal');
const checkDecisionDateDeadline = require('#middleware/check-decision-date-deadline');

const router = express.Router();

router.get(
	'/can-use-service',
	[fetchExistingAppealMiddleware, checkDecisionDateDeadline],
	canUseService.getCanUseService
);

module.exports = router;
