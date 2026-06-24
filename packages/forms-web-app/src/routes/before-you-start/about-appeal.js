const express = require('express');
const fetchExistingAppealMiddleware = require('../../middleware/fetch-existing-appeal');
const typeOfPlanningApplicationController = require('../../controllers/full-appeal/about-appeal');
const {
	rules: typeOfPlanningDepartmentValidationRules
} = require('../../validators/full-appeal/about-appeal');
const { validationErrorHandler } = require('../../validators/validation-error-handler');

const router = express.Router();

router.get(
	'/type-of-planning-application',
	[fetchExistingAppealMiddleware],
	typeOfPlanningApplicationController.redirectToNewAppealAboutUrl
);

router.get(
	'/about-appeal',
	[fetchExistingAppealMiddleware],
	typeOfPlanningApplicationController.getTypeOfPlanningApplication
);

router.post(
	'/about-appeal',
	typeOfPlanningDepartmentValidationRules(),
	validationErrorHandler,
	typeOfPlanningApplicationController.postTypeOfPlanningApplication
);

module.exports = router;
