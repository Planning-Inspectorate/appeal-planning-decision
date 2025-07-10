const express = require('express');

const router = express.Router();
const MapCache = require('../../lib/map-cache');

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

const emailUUIDcache = new MapCache(5);

const views = { YOUR_EMAIL_ADDRESS, ENTER_CODE };

router.get('/your-email-address', getYourEmailAddress(views));
router.post(
	'/your-email-address',
	emailAddressValidationRules('email-address'),
	validationErrorHandler,
	postYourEmailAddress(views, emailUUIDcache)
);

module.exports = router;
