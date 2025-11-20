const express = require('express');

const fetchExistingAppealMiddleware = require('../../middleware/fetch-existing-appeal');
const enforcementReferenceNumberController = require('../../controllers/enforcement/enforcement-reference-number');
const { validationErrorHandler } = require('../../validators/validation-error-handler');
const {
	rules: referenceNumberValidationRules
} = require('../../validators/enforcement/reference-number');
const {
	VIEW: {
		ENFORCEMENT: { ENFORCEMENT_REFERENCE_NUMBER, EMAIL_ADDRESS }
	}
} = require('#lib/views');

const router = express.Router();
const views = {
	ENFORCEMENT_REFERENCE_NUMBER, // nunjucks template for current page
	EMAIL_ADDRESS // url for next page
};

router.get(
	'/enforcement-reference-number',
	[fetchExistingAppealMiddleware],
	enforcementReferenceNumberController.getEnforcementReferenceNumber(views)
);
router.post(
	'/enforcement-reference-number',
	referenceNumberValidationRules(),
	validationErrorHandler,
	enforcementReferenceNumberController.postEnforcementReferenceNumber(views)
);

module.exports = router;
