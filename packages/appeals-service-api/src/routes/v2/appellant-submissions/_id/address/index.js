const express = require('express');
const { createSubmissionAddress, deleteSubmissionAddress } = require('./controller');
const asyncHandler = require('@pins/common/src/middleware/async-handler');
const router = express.Router({ mergeParams: true });

// Document upload routes
router.post('/', asyncHandler(createSubmissionAddress));
router.delete('/:addressId', asyncHandler(deleteSubmissionAddress));

module.exports = { router };
