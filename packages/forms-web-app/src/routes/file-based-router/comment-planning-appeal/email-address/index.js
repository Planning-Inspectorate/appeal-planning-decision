const express = require('express');
const { emailAddressGet, emailAddressPost } = require('./controller');
const asyncHandler = require('@pins/common/src/middleware/async-handler');
const {
	rules: emailAddressValidationRules
} = require('../../../../validators/interested-parties/email-address');
const { validationErrorHandler } = require('../../../../validators/validation-error-handler');
const checkInterestedPartySessionActive = require('../../../../middleware/interested-parties/check-ip-session-set');

const router = express.Router();

router.get('/', checkInterestedPartySessionActive, asyncHandler(emailAddressGet));
router.post(
	'/',
	checkInterestedPartySessionActive,
	emailAddressValidationRules(),
	validationErrorHandler,
	asyncHandler(emailAddressPost)
);

module.exports = { router };
