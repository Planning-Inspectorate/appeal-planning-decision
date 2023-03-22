const express = require('express');
const enterSecurityCodeController = require('../../controllers/final-comment/enter-security-code');
const { validationErrorHandler } = require('../../validators/validation-error-handler');
const { rules: emailCodeValidationRules } = require('../../validators/final-comment/email-code');

const router = express.Router();

router.get('/input-code', enterSecurityCodeController.getEnterSecurityCode);
router.post(
	'/input-code',
	emailCodeValidationRules(),
	validationErrorHandler,
	enterSecurityCodeController.postEnterSecurityCode
);

module.exports = router;
