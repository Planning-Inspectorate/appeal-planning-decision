const express = require('express');
const { enterAddressGet, enterAddressPost } = require('./controller');
const {
	rules: enterAddressValidationRules
} = require('../../../../validators/interested-parties/enter-address');
const { validationErrorHandler } = require('../../../../validators/validation-error-handler');
const asyncHandler = require('@pins/common/src/middleware/async-handler');
const checkInterestedPartySessionActive = require('../../../../middleware/interested-parties/check-ip-session-set');

const router = express.Router();

router.get('/', checkInterestedPartySessionActive, asyncHandler(enterAddressGet));
router.post(
	'/',
	checkInterestedPartySessionActive,
	enterAddressValidationRules(),
	validationErrorHandler,
	asyncHandler(enterAddressPost)
);

module.exports = { router };
