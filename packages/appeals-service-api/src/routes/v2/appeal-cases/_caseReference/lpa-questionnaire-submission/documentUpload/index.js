const express = require('express');
const { createSubmissionDocumentUpload } = require('./controller');
const asyncHandler = require('#middleware/async-handler');
const router = express.Router({ mergeParams: true });

// Document upload routes
router.post('/', asyncHandler(createSubmissionDocumentUpload));

module.exports = { router };
