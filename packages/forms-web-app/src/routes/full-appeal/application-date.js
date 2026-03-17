const express = require('express');
const {
	getApplicationDate,
	postApplicationDate
} = require('../../controllers/full-appeal/application-date');
const convertMonthNameToNumber = require('#middleware/convert-month-name-to-number');
const { validationErrorHandler } = require('../../validators/validation-error-handler');
const {
	rules: applicationDateValidationRules
} = require('../../validators/full-appeal/application-date');
const fetchExistingAppealMiddleware = require('#middleware/fetch-existing-appeal');

const router = express.Router();

router.get('/application-date', [fetchExistingAppealMiddleware], getApplicationDate);

router.post(
	'/application-date',
	convertMonthNameToNumber,
	applicationDateValidationRules(),
	validationErrorHandler,
	postApplicationDate
);

module.exports = router;
