const express = require('express');
const commonEmailAddressController = require('../../controllers/common/email-address');
const { validationErrorHandler } = require('../../validators/validation-error-handler');
const {
	rules: emailAddressValidationRules
} = require('../../validators/full-appeal/email-address');

const {
	VIEW: {
		APPEAL: { EMAIL_ADDRESS, ENTER_CODE }
	}
} = require('../../lib/views');

const views = {
	EMAIL_ADDRESS,
	ENTER_CODE
};

const router = express.Router();

router.get('/email-address', commonEmailAddressController.getEmailAddress(views));
router.post(
	'/email-address',
	emailAddressValidationRules(),
	validationErrorHandler,
	commonEmailAddressController.postEmailAddress(views)
);

module.exports = router;
