const express = require('express');

const fetchExistingAppealMiddleware = require('../../../middleware/fetch-existing-appeal');
const commonEmailAddressController = require('../../../controllers/common/email-address');
const { validationErrorHandler } = require('../../../validators/validation-error-handler');
const {
	rules: emailAddressValidationRules
} = require('../../../validators/full-appeal/email-address');

const {
	VIEW: {
		FULL_APPEAL: { EMAIL_ADDRESS, ENTER_CODE }
	}
} = require('../../../lib/views');

const views = {
	EMAIL_ADDRESS,
	ENTER_CODE
};

const router = express.Router();

router.get(
	'/submit-appeal/email-address',
	[fetchExistingAppealMiddleware],
	commonEmailAddressController.getEmailAddress(views, true)
);
router.post(
	'/submit-appeal/email-address',
	emailAddressValidationRules(),
	validationErrorHandler,
	commonEmailAddressController.postEmailAddress(views, true)
);

module.exports = router;
