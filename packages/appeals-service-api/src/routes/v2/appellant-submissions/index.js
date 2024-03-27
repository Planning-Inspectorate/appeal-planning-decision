const express = require('express');
const { put } = require('./controller');
const router = express.Router();
const asyncHandler = require('@pins/common/src/middleware/async-handler');
const { openApiValidatorMiddleware } = require('../../../validators/validate-open-api');

router.put('/', openApiValidatorMiddleware(), asyncHandler(put));

module.exports = { router };
