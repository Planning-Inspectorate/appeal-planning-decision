const express = require('express');
const { getSubmissionUploads, createSubmissionDocumentUpload } = require('./controller');
const asyncHandler = require('#middleware/async-handler');
const router = express.Router({ mergeParams: true });

// Document upload routes
router.get('/', asyncHandler(getSubmissionUploads));
router.post('/', asyncHandler(createSubmissionDocumentUpload));

module.exports = { router };
