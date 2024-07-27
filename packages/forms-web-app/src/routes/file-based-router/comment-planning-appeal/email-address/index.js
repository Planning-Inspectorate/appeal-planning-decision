const express = require('express');
const { emailAddressGet, emailAddressPost } = require('./controller');
const asyncHandler = require('@pins/common/src/middleware/async-handler');
const {
	rules: emailAddressValidationRules
} = require('../../../../validators/interested-parties/email-address');
const { validationErrorHandler } = require('../../../../validators/validation-error-handler');

const router = express.Router();

router.get('/', asyncHandler(emailAddressGet));
router.post(
	'/',
	emailAddressValidationRules(),
	validationErrorHandler,
	asyncHandler(emailAddressPost)
);

module.exports = { router };
