const express = require('express');
const { addCommentsGet, addCommentsPost } = require('./controller');
const {
	rules: addCommentsValidationRules
} = require('../../../../validators/interested-parties/add-comments');
const { validationErrorHandler } = require('../../../../validators/validation-error-handler');
const asyncHandler = require('@pins/common/src/middleware/async-handler');
const checkInterestedPartySessionActive = require('../../../../middleware/interested-parties/check-ip-session-set');

const router = express.Router();

router.get('/', checkInterestedPartySessionActive, asyncHandler(addCommentsGet));
router.post(
	'/',
	checkInterestedPartySessionActive,
	addCommentsValidationRules(),
	validationErrorHandler,
	asyncHandler(addCommentsPost)
);

module.exports = { router };
