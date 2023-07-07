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

router.get('/manage-appeals/your-email-address', getYourEmailAddress(views));
router.post(
	'/manage-appeal/your-email-address',
	emailAddressValidationRules(),
	validationErrorHandler,
	postYourEmailAddress(views)
);

module.exports = router;
