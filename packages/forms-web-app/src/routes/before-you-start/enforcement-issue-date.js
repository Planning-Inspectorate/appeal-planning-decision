const express = require('express');
const fetchExistingAppealMiddleware = require('../../middleware/fetch-existing-appeal');
const enforcementIssueDateController = require('../../controllers/before-you-start/enforcement-issue-date');
const { validationErrorHandler } = require('../../validators/validation-error-handler');
const {
	rules: enforcementIssueDateValidationRules
} = require('../../validators/before-you-start/enforcement-issue-date');

const router = express.Router();

router.get(
	'/enforcement-issue-date',
	[fetchExistingAppealMiddleware],
	enforcementIssueDateController.getEnforcementIssueDate
);

router.post(
	'/enforcement-issue-date',
	enforcementIssueDateValidationRules(),
	validationErrorHandler,
	enforcementIssueDateController.postEnforcementIssueDate
);

module.exports = router;
