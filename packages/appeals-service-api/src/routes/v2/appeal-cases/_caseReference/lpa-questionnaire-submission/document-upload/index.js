const express = require('express');
const { createSubmissionDocumentUpload, deleteSubmissionDocumentUpload } = require('./controller');
const asyncHandler = require('@pins/common/src/middleware/async-handler');
const router = express.Router({ mergeParams: true });

// Document upload routes
router.post('/', asyncHandler(createSubmissionDocumentUpload));
router.delete('/:documentId', asyncHandler(deleteSubmissionDocumentUpload));

module.exports = { router };
