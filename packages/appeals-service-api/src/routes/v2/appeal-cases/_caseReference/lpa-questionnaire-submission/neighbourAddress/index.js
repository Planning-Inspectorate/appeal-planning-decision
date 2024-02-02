const express = require('express');
const { createSubmissionNeighbourAddress } = require('./controller');
const asyncHandler = require('#middleware/async-handler');
const router = express.Router({ mergeParams: true });

// Document upload routes
router.post('/', asyncHandler(createSubmissionNeighbourAddress));

module.exports = { router };
