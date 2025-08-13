const express = require('express');

const fetchExistingAppealMiddleware = require('../../middleware/fetch-existing-appeal');
const decisionDateController = require('../../controllers/full-appeal/decision-date');
const {
	rules: decisionDateValidationRules
} = require('../../validators/full-appeal/decision-date');
const { validationErrorHandler } = require('../../validators/validation-error-handler');
const convertMonthNameToNumber = require('#middleware/convert-month-name-to-number');

const router = express.Router();

router.get(
	'/decision-date',
	[fetchExistingAppealMiddleware],
	decisionDateController.getDecisionDate
);

router.post(
	'/decision-date',
	convertMonthNameToNumber,
	decisionDateValidationRules(),
	validationErrorHandler,
	decisionDateController.postDecisionDate
);

module.exports = router;
