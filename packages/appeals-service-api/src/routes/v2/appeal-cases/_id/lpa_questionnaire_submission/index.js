const express = require('express');
const { getLPAQuestionnaireSubmission } = require('./controller');
const asyncHandler = require('#middleware/async-handler');
const router = express.Router({ mergeParams: true });

router.get('/', asyncHandler(getLPAQuestionnaireSubmission));

module.exports = { router };
