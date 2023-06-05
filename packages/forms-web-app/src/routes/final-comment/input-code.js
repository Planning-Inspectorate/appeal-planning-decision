const express = require('express');
const inputCodeController = require('../../controllers/final-comment/input-code');
const codeExpired = require('../../controllers/common/code-expired');
const { validationErrorHandler } = require('../../validators/validation-error-handler');
const { rules: emailCodeValidationRules } = require('../../validators/final-comment/email-code');

const router = express.Router();

router.get('/input-code', inputCodeController.getInputCode);
router.get('/input-code/resend-code', inputCodeController.getInputCodeResendCode);
router.get('/full-appeal/submit-final-comment/code-expired', codeExpired.getCodeExpired);

router.post(
	'/input-code',
	emailCodeValidationRules(),
	validationErrorHandler,
	inputCodeController.postInputCode
);

module.exports = router;
