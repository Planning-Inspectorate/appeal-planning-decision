const express = require('express');
const inputCodeController = require('../../controllers/final-comment/input-code');
const { validationErrorHandler } = require('../../validators/validation-error-handler');
const { rules: emailCodeValidationRules } = require('../../validators/final-comment/email-code');

const router = express.Router();

router.get('/input-code', inputCodeController.getInputCode);
router.get('/input-code/resend-code', inputCodeController.getInputCodeResendCode);

router.post(
	'/input-code',
	emailCodeValidationRules(),
	validationErrorHandler,
	inputCodeController.postInputCode
);

module.exports = router;
