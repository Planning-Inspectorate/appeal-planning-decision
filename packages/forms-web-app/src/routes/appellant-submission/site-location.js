const express = require('express');

const fetchExistingAppealMiddleware = require('../../middleware/fetch-existing-appeal');
const siteLocationController = require('../../controllers/appellant-submission/site-location');
const { validationErrorHandler } = require('../../validators/validation-error-handler');
const {
	rules: siteLocationValidationRules
} = require('../../validators/appellant-submission/site-location');

const router = express.Router();

router.get(
	'/site-location',
	[fetchExistingAppealMiddleware],
	siteLocationController.getSiteLocation
);
router.post(
	'/site-location',
	siteLocationValidationRules(),
	validationErrorHandler,
	siteLocationController.postSiteLocation
);

module.exports = router;
