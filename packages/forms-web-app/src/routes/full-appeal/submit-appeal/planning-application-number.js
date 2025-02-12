const express = require('express');

const fetchExistingAppealMiddleware = require('../../../middleware/fetch-existing-appeal');
const planningApplicationNumberController = require('../../../controllers/full-appeal/submit-appeal/planning-application-number');
const { validationErrorHandler } = require('../../../validators/validation-error-handler');
const {
	rules: applicationNumberValidationRules
} = require('../../../validators/full-appeal/application-number');

const router = express.Router();

router.get(
	'/submit-appeal/planning-application-number',
	[fetchExistingAppealMiddleware],
	planningApplicationNumberController.getPlanningApplicationNumber()
);
router.post(
	'/submit-appeal/planning-application-number',
	applicationNumberValidationRules(),
	validationErrorHandler,
	planningApplicationNumberController.postPlanningApplicationNumber()
);

module.exports = router;
