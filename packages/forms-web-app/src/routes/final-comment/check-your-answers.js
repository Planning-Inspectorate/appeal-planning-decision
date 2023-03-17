const express = require('express');

const checkYourAnswersController = require('../../controllers/final-comment/check-your-answers');
const { validationErrorHandler } = require('../../validators/validation-error-handler');
const { rules: optionsValidationRules } = require('../../validators/common/options');

const router = express.Router();

router.get('/check-your-answers', checkYourAnswersController.getCheckYourAnswers);
router.post(
	'/check-your-answers',
	optionsValidationRules({
		fieldName: 'check-your-answers',
		emptyError: 'Select yes to enter your final comment'
	}),
	validationErrorHandler,
	checkYourAnswersController.postCheckYourAnswers
);

module.exports = router;
