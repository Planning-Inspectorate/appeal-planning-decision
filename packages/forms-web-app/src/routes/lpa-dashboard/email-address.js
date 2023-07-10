const express = require('express');
const { rules: validateEmailAddressRules } = require('../../validators/common/lpa-user-email');
const { validationErrorHandler } = require('../../validators/validation-error-handler');

const {
	getEmailAddress,
	postEmailAddress
} = require('../../controllers/lpa-dashboard/email-address');

const router = express.Router();

router.get('/email-address', getEmailAddress);
router.post(
	'/email-address',
	validateEmailAddressRules(),
	validationErrorHandler,
	postEmailAddress
);

module.exports = router;
