const express = require('express');
const { get, patch } = require('./controller');
const router = express.Router();
const asyncHandler = require('@pins/common/src/middleware/async-handler');
const { openApiValidatorMiddleware } = require('../../../../validators/validate-open-api');

router.get('/', openApiValidatorMiddleware(), asyncHandler(get));
router.patch('/', openApiValidatorMiddleware(), asyncHandler(patch));

module.exports = { router };
