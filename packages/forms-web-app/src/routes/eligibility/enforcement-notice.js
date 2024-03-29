const express = require('express');

const fetchExistingAppealMiddleware = require('../../middleware/fetch-existing-appeal');
const enforcementNoticeController = require('../../controllers/eligibility/enforcement-notice');
const { validationErrorHandler } = require('../../validators/validation-error-handler');
const {
	rules: enforcementNoticeValidationRules
} = require('../../validators/eligibility/enforcement-notice');

const router = express.Router();

router.get(
	'/enforcement-notice-out',
	enforcementNoticeController.getServiceNotAvailableWhenReceivedEnforcementNotice
);
router.get(
	'/enforcement-notice',
	[fetchExistingAppealMiddleware],
	enforcementNoticeController.getEnforcementNotice
);
router.post(
	'/enforcement-notice',
	enforcementNoticeValidationRules(),
	validationErrorHandler,
	enforcementNoticeController.postEnforcementNotice
);

module.exports = router;
