const express = require('express');
const {
	getLPAQuestionnaireSubmission,
	putLPAQuestionnaireSubmission,
	createLPAQuestionnaireSubmission
} = require('./controller');
const asyncHandler = require('#middleware/async-handler');
const router = express.Router({ mergeParams: true });

router.get('/', asyncHandler(getLPAQuestionnaireSubmission));
router.post('/', asyncHandler(createLPAQuestionnaireSubmission));
router.put('/', asyncHandler(putLPAQuestionnaireSubmission));

module.exports = { router };
