const express = require('express');
const { documentsToSupportGet, documentsToSupportPost } = require('./controller');
const asyncHandler = require('@pins/common/src/middleware/async-handler');
const { rules: optionsValidationRules } = require('../../../../validators/common/options');
const { validationErrorHandler } = require('../../../../validators/validation-error-handler');
const checkInterestedPartySessionActive = require('../../../../middleware/interested-parties/check-ip-session-set');

const router = express.Router();

router.get('/', checkInterestedPartySessionActive, asyncHandler(documentsToSupportGet));
router.post(
	'/',
	checkInterestedPartySessionActive,
	optionsValidationRules({
		fieldName: 'documents-to-support-comment',
		emptyError: 'Select yes if you have additional documents to support your comment'
	}),
	validationErrorHandler,
	asyncHandler(documentsToSupportPost)
);

module.exports = { router };
