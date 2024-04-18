const express = require('express');
const {
	createQuestionnaireListedBuilding,
	deleteQuestionnaireListedBuilding
} = require('./controller');
const asyncHandler = require('@pins/common/src/middleware/async-handler');
const router = express.Router({ mergeParams: true });

// Linked Case routes
router.post('/', asyncHandler(createQuestionnaireListedBuilding));
router.delete('/:listedId', asyncHandler(deleteQuestionnaireListedBuilding));

module.exports = { router };
