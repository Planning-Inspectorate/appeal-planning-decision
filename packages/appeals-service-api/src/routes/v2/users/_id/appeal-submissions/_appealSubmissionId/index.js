const express = require('express');
const { getUserAppealSubmission } = require('./controller');
const asyncHandler = require('@pins/common/src/middleware/async-handler');
const router = express.Router({ mergeParams: true });

router.get('/', asyncHandler(getUserAppealSubmission));

module.exports = { router };
