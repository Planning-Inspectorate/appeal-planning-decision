const express = require('express');
const {
	getLPAQuestionnaireSubmission,
	patchLPAQuestionnaireSubmission,
	createLPAQuestionnaireSubmission
} = require('./controller');
const asyncHandler = require('#middleware/async-handler');
const router = express.Router({ mergeParams: true });

router.get('/', asyncHandler(getLPAQuestionnaireSubmission));
router.post('/', asyncHandler(createLPAQuestionnaireSubmission));
router.patch('/', asyncHandler(patchLPAQuestionnaireSubmission));

module.exports = { router };
