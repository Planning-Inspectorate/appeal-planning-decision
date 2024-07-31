const express = require('express');
const asyncHandler = require('@pins/common/src/middleware/async-handler');
const { openApiValidatorMiddleware } = require('../../../validators/validate-open-api');
const { post } = require('./controller');
const router = express.Router({ mergeParams: true });

router.post('/', openApiValidatorMiddleware(), asyncHandler(post));

module.exports = { router };
