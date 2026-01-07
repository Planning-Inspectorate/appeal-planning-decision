const express = require('express');
const fetchExistingAppealMiddleware = require('../../middleware/fetch-existing-appeal');
const applicationLookupController = require('../../controllers/before-you-start/application-lookup');
const applicationLookupFailedController = require('../../controllers/before-you-start/application-not-found');
const { validationErrorHandler } = require('../../validators/validation-error-handler');
const {
	rules: applicationLookupValidationRules
} = require('../../validators/before-you-start/application-lookup');
const {
	rules: applicationNotFoundValidationRules
} = require('../../validators/before-you-start/application-not-found');

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

router.get(
	'/application-not-found',
	[fetchExistingAppealMiddleware],
	applicationLookupFailedController.getApplicationFailedLookup
);

router.post(
	'/application-not-found',
	applicationNotFoundValidationRules(),
	validationErrorHandler,
	applicationLookupFailedController.postApplicationFailedLookup
);

module.exports = router;
