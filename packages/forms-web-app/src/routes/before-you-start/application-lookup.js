const express = require('express');
const fetchExistingAppealMiddleware = require('../../middleware/fetch-existing-appeal');
const applicationLookupController = require('../../controllers/before-you-start/application-lookup');
const { validationErrorHandler } = require('../../validators/validation-error-handler');
const {
	rules: applicationLookupValidationRules
} = require('../../validators/before-you-start/application-lookup');

const router = express.Router();

router.get(
	'/application-number',
	[fetchExistingAppealMiddleware],
	applicationLookupController.getApplicationLookup
);

router.post(
	'/application-number',
	applicationLookupValidationRules(),
	validationErrorHandler,
	applicationLookupController.postApplicationLookup
);

module.exports = router;
