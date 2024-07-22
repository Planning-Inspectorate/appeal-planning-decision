const express = require('express');
const { yourNameGet, yourNamePost } = require('./controller');
const {
	rules: yourNameValidationRules
} = require('../../../../validators/interested-parties/your-name');
const { validationErrorHandler } = require('../../../../validators/validation-error-handler');
const asyncHandler = require('@pins/common/src/middleware/async-handler');

const router = express.Router();

router.get('/', asyncHandler(yourNameGet));
router.post('/', yourNameValidationRules(), validationErrorHandler, asyncHandler(yourNamePost));

module.exports = { router };
