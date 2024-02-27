const express = require('express');
const asyncHandler = require('@pins/common/src/middleware/async-handler');
const { post } = require('./controller');
const router = express.Router({ mergeParams: true });

router.post('/', asyncHandler(post));

module.exports = { router };
