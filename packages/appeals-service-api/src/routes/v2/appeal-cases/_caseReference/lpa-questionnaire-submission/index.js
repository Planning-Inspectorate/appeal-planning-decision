const express = require('express');
const {
	getLPAQuestionnaireSubmission,
	patchLPAQuestionnaireSubmission,
	createLPAQuestionnaireSubmission
} = require('./controller');
const asyncHandler = require('@pins/common/src/middleware/async-handler');
const router = express.Router({ mergeParams: true });

// Questionnaire routes
router.get('/', asyncHandler(getLPAQuestionnaireSubmission));
router.post('/', asyncHandler(createLPAQuestionnaireSubmission));
router.patch('/', asyncHandler(patchLPAQuestionnaireSubmission));

module.exports = { router };
