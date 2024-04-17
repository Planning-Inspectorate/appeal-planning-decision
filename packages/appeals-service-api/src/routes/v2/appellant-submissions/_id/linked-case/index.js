const express = require('express');
const { createSubmissionLinkedCase, deleteSubmissionLinkedCase } = require('./controller');
const asyncHandler = require('@pins/common/src/middleware/async-handler');
const router = express.Router({ mergeParams: true });

// Linked Case routes
router.post('/', asyncHandler(createSubmissionLinkedCase));
router.delete('/:linkedCaseId', asyncHandler(deleteSubmissionLinkedCase));

module.exports = { router };
