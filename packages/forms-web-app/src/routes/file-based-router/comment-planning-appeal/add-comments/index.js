const express = require('express');
const { addCommentsGet, addCommentsPost } = require('./controller');
const {
	rules: yourNameValidationRules
} = require('../../../../validators/interested-parties/email-address');
const { validationErrorHandler } = require('../../../../validators/validation-error-handler');
const asyncHandler = require('@pins/common/src/middleware/async-handler');

const router = express.Router();

router.get('/', asyncHandler(addCommentsGet));
router.post('/', yourNameValidationRules(), validationErrorHandler, asyncHandler(addCommentsPost));

module.exports = { router };
