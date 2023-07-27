const express = require('express');

const router = express.Router();

const { rules: emailAddressValidationRules } = require('../../validators/common/email-address');
const { validationErrorHandler } = require('../../validators/validation-error-handler');

const {
	getYourEmailAddress,
	postYourEmailAddress
} = require('../../controllers/common/your-email-address');

const {
	VIEW: {
		LPA_DASHBOARD: { YOUR_EMAIL_ADDRESS, ENTER_CODE }
	}
} = require('../../lib/views');

const views = { YOUR_EMAIL_ADDRESS, ENTER_CODE };

router.get('/your-email-address/:id', getYourEmailAddress(views));
router.post(
	'/your-email-address/:id',
	emailAddressValidationRules('email-address'),
	validationErrorHandler,
	postYourEmailAddress(views)
);

module.exports = router;
