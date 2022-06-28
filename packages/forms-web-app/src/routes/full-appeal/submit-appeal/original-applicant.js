const express = require('express');
const {
	getOriginalApplicant,
	postOriginalApplicant
} = require('../../../controllers/full-appeal/submit-appeal/original-applicant');
const fetchExistingAppealMiddleware = require('../../../middleware/fetch-existing-appeal');
const { validationErrorHandler } = require('../../../validators/validation-error-handler');
const {
	rules: originalApplicantValidationRules
} = require('../../../validators/full-appeal/original-applicant');

const router = express.Router();

router.get(
	'/submit-appeal/original-applicant',
	[fetchExistingAppealMiddleware],
	getOriginalApplicant
);
router.post(
	'/submit-appeal/original-applicant',
	originalApplicantValidationRules(),
	validationErrorHandler,
	postOriginalApplicant
);

module.exports = router;
