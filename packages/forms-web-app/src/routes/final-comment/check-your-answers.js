const express = require('express');

const checkYourAnswersController = require('../../controllers/final-comment/check-your-answers');
const { validationErrorHandler } = require('../../validators/validation-error-handler');

const router = express.Router();

router.get('/check-your-answers', checkYourAnswersController.getCheckYourAnswers);
router.post(
	'/check-your-answers',
	validationErrorHandler,
	checkYourAnswersController.postCheckYourAnswers
);

module.exports = router;
