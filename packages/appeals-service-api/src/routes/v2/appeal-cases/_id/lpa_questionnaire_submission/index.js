const express = require('express');
const { getLPAQuestionnaireSubmission, putLPAQuestionnaireSubmission } = require('./controller');
const asyncHandler = require('#middleware/async-handler');
const router = express.Router({ mergeParams: true });

router.get('/', asyncHandler(getLPAQuestionnaireSubmission));
router.put('/', asyncHandler(putLPAQuestionnaireSubmission));

module.exports = { router };
