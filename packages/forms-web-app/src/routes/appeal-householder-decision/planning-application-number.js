const express = require('express');

const fetchExistingAppealMiddleware = require('../../middleware/fetch-existing-appeal');
const {
	getPlanningApplicationNumber,
	postPlanningApplicationNumber
} = require('../../controllers/appeal-householder-decision/planning-application-number');
const { validationErrorHandler } = require('../../validators/validation-error-handler');
const {
	rules: applicationNumberValidationRules
} = require('../../validators/appellant-submission/application-number');

const router = express.Router();

router.get(
	'/planning-application-number',
	[fetchExistingAppealMiddleware],
	getPlanningApplicationNumber
);
router.post(
	'/planning-application-number',
	applicationNumberValidationRules(),
	validationErrorHandler,
	postPlanningApplicationNumber
);

module.exports = router;
