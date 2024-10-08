const express = require('express');

const router = express.Router();

const { rules: emailAddressValidationRules } = require('../../validators/common/email-address');
const { validationErrorHandler } = require('../../validators/validation-error-handler');

const {
	getR6EmailAddress,
	postR6EmailAddress
} = require('../../controllers/common/rule-6-email-address');

const {
	VIEW: {
		RULE_6_APPEALS: { EMAIL_ADDRESS, ENTER_CODE }
	}
} = require('../../lib/views');

const views = { EMAIL_ADDRESS, ENTER_CODE };

router.get('/email-address', getR6EmailAddress(views));
router.post(
	'/email-address',
	emailAddressValidationRules('email-address'),
	validationErrorHandler,
	postR6EmailAddress(views)
);

module.exports = router;
