const express = require('express');

const commentsQuestionController = require('../../controllers/final-comment/comments-question');
const { validationErrorHandler } = require('../../validators/validation-error-handler');
const { rules: optionsValidationRules } = require('../../validators/common/options');

const router = express.Router();

router.get('/comments-question', commentsQuestionController.getCommentsQuestion);
router.post(
	'/comments-question',
	optionsValidationRules({
		fieldName: 'comments-question',
		emptyError: 'Select yes to enter your final comment'
	}),
	validationErrorHandler,
	commentsQuestionController.postCommentsQuestion
);

module.exports = router;
