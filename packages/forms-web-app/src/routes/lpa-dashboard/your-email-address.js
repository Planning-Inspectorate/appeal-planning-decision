const express = require('express');

const router = express.Router();

const { rules: emailAddressValidationRules } = require('../../validators/common/email-address');
const { validationErrorHandler } = require('../../validators/validation-error-handler');

const {
	getYourEmailAddressLPA,
	postYourEmailAddressLPA
} = require('../../controllers/common/your-email-address');

const {
	VIEW: {
		LPA_DASHBOARD: { YOUR_EMAIL_ADDRESS, ENTER_CODE }
	}
} = require('../../lib/views');

const views = { YOUR_EMAIL_ADDRESS, ENTER_CODE };

router.get('/your-email-address', getYourEmailAddressLPA(views));
router.post(
	'/your-email-address',
	emailAddressValidationRules('email-address'),
	validationErrorHandler,
	postYourEmailAddressLPA(views)
);

module.exports = router;
