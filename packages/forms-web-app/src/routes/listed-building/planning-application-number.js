const express = require('express');

const fetchExistingAppealMiddleware = require('../../middleware/fetch-existing-appeal');
const planningApplicationNumberController = require('../../controllers/full-appeal/submit-appeal/planning-application-number');
const { validationErrorHandler } = require('../../validators/validation-error-handler');
const {
	rules: applicationNumberValidationRules
} = require('../../validators/full-appeal/application-number');
const {
	VIEW: {
		FULL_APPEAL: { PLANNING_APPLICATION_NUMBER },
		LISTED_BUILDING: { EMAIL_ADDRESS }
	}
} = require('#lib/views');

const router = express.Router();
const views = {
	PLANNING_APPLICATION_NUMBER, // nunjucks template for current page
	EMAIL_ADDRESS // url for next page
};

router.get(
	'/planning-application-number',
	[fetchExistingAppealMiddleware],
	planningApplicationNumberController.getPlanningApplicationNumber(views)
);
router.post(
	'/planning-application-number',
	applicationNumberValidationRules(),
	validationErrorHandler,
	planningApplicationNumberController.postPlanningApplicationNumber(views)
);

module.exports = router;
