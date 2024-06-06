const express = require('express');
const { selectedAppeal } = require('./controller');
const asyncHandler = require('@pins/common/src/middleware/async-handler');

const router = express.Router({ mergeParams: true });

router.get('/', asyncHandler(selectedAppeal));

module.exports = { router };
