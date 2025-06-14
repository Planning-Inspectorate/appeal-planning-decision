const express = require('express');
const fetchExistingAppealMiddleware = require('../../middleware/fetch-existing-appeal');
const planningApplicationAboutController = require('../../controllers/before-you-start/planning-application-about');
const {
	rules: applicationAboutValidationRules
} = require('../../validators/before-you-start/planning-application-about');
const { validationErrorHandler } = require('../../validators/validation-error-handler');

const router = express.Router();

router.get(
	'/planning-application-about',
	[fetchExistingAppealMiddleware],
	planningApplicationAboutController.getApplicationAbout
);

router.post(
	'/planning-application-about',
	applicationAboutValidationRules(),
	validationErrorHandler,
	planningApplicationAboutController.postApplicationAbout
);

module.exports = router;
