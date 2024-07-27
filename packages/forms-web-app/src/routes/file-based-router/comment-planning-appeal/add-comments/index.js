const express = require('express');
const { addCommentsGet, addCommentsPost } = require('./controller');
const {
	rules: addCommentsValidationRules
} = require('../../../../validators/interested-parties/add-comments');
const { validationErrorHandler } = require('../../../../validators/validation-error-handler');
const asyncHandler = require('@pins/common/src/middleware/async-handler');

const router = express.Router();

router.get('/', asyncHandler(addCommentsGet));
router.post(
	'/',
	addCommentsValidationRules(),
	validationErrorHandler,
	asyncHandler(addCommentsPost)
);

module.exports = { router };
