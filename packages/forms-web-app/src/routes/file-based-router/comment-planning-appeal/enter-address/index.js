const express = require('express');
const { enterAddressGet, enterAddressPost } = require('./controller');
const {
	rules: enterAddressValidationRules
} = require('../../../../validators/interested-parties/enter-address');
const { validationErrorHandler } = require('../../../../validators/validation-error-handler');
const asyncHandler = require('@pins/common/src/middleware/async-handler');

const router = express.Router();

router.get('/', asyncHandler(enterAddressGet));
router.post(
	'/',
	enterAddressValidationRules(),
	validationErrorHandler,
	asyncHandler(enterAddressPost)
);

module.exports = { router };
