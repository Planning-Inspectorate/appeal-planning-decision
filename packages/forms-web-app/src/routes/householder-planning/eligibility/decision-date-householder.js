const express = require('express');

const fetchExistingAppealMiddleware = require('../../../middleware/fetch-existing-appeal');
const decisionDateHouseholderController = require('../../../controllers/householder-planning/eligibility/decision-date-householder');
const {
	rules: decisionDateHouseholderValidationRules
} = require('../../../validators/householder-planning/eligibility/decision-date-householder');
const { validationErrorHandler } = require('../../../validators/validation-error-handler');
const convertMonthNameToNumber = require('#middleware/convert-month-name-to-number');

const router = express.Router();

router.get(
	'/decision-date-householder',
	[fetchExistingAppealMiddleware],
	decisionDateHouseholderController.getDecisionDateHouseholder
);

router.post(
	'/decision-date-householder',
	convertMonthNameToNumber,
	decisionDateHouseholderValidationRules(),
	validationErrorHandler,
	decisionDateHouseholderController.postDecisionDateHouseholder
);

module.exports = router;
