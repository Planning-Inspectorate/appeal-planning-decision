const express = require('express');
const {
	getLPAStatementSubmission,
	patchLPAStatementSubmission,
	createLPAStatementSubmission
} = require('./controller');
const asyncHandler = require('@pins/common/src/middleware/async-handler');
const router = express.Router({ mergeParams: true });

// Statement routes
router.get('/', asyncHandler(getLPAStatementSubmission));
router.post('/', asyncHandler(createLPAStatementSubmission));
router.patch('/', asyncHandler(patchLPAStatementSubmission));

module.exports = { router };
