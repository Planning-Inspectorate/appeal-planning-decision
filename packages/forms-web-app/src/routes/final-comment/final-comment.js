const express = require('express');
const finalCommentController = require('../../controllers/final-comment/final-comment');
const { validationErrorHandler } = require('../../validators/validation-error-handler');
const {
	rules: finalCommentValidationRules
} = require('../../validators/final-comment/final-comment');

const router = express.Router();

router.get('/final-comment', finalCommentController.getAddFinalComment);
router.post(
	'/final-comment',
	finalCommentValidationRules(),
	validationErrorHandler,
	finalCommentController.postAddFinalComment
);

module.exports = router;
