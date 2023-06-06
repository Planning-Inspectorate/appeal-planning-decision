const express = require('express');
const inputCodeController = require('../../controllers/final-comment/input-code');
const { validationErrorHandler } = require('../../validators/validation-error-handler');
const { rules: emailCodeValidationRules } = require('../../validators/final-comment/email-code');
const checkFinalCommentTestEnabled = require('../../middleware/final-comment/check-final-comment-test-enabled');

const router = express.Router();

router.get(
	'/input-code/:caseReference',
	checkFinalCommentTestEnabled,
	inputCodeController.getInputCode
);
router.get('/input-code/resend-code/:caseReference', inputCodeController.getInputCodeResendCode);

router.post(
	'/input-code/:caseReference',
	emailCodeValidationRules(),
	validationErrorHandler,
	inputCodeController.postInputCode
);

module.exports = router;
