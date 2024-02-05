const express = require('express');
const {
	getSubmissionNeighbourAddresses,
	createSubmissionNeighbourAddress
} = require('./controller');
const asyncHandler = require('#middleware/async-handler');
const router = express.Router({ mergeParams: true });

// Document upload routes
router.get('/', asyncHandler(getSubmissionNeighbourAddresses));
router.post('/', asyncHandler(createSubmissionNeighbourAddress));

module.exports = { router };
