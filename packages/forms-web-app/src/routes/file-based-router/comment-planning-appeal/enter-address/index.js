const express = require('express');
const { enterAddressGet, enterAddressPost } = require('./controller');
const {
	rules: yourNameValidationRules
} = require('../../../../validators/interested-parties/your-name');
const { validationErrorHandler } = require('../../../../validators/validation-error-handler');
const asyncHandler = require('@pins/common/src/middleware/async-handler');

const router = express.Router();

router.get('/', asyncHandler(enterAddressGet));
router.post('/', yourNameValidationRules(), validationErrorHandler, asyncHandler(enterAddressPost));

module.exports = { router };
