const express = require('express');
const { appealDetails } = require('./controller');
const asyncHandler = require('@pins/common/src/middleware/async-handler');

const router = express.Router({ mergeParams: true });

router.get('/', asyncHandler(appealDetails));

module.exports = { router };
