const express = require('express');

const fetchExistingAppealMiddleware = require('../../../middleware/fetch-existing-appeal');
const commonEmailAddressController = require('../../../controllers/common/email-address');
const { validationErrorHandler } = require('../../../validators/validation-error-handler');
const {
	rules: emailAddressValidationRules
} = require('../../../validators/full-appeal/email-address');

const {
	VIEW: {
		FULL_APPEAL: { EMAIL_ADDRESS },
		ENFORCEMENT: { ENTER_CODE }
	}
} = require('#lib/views');

const views = {
	EMAIL_ADDRESS, // nunjucks template for current page
	ENTER_CODE // next page url
};

const router = express.Router();

router.get(
	'/email-address',
	[fetchExistingAppealMiddleware],
	commonEmailAddressController.getEmailAddress(views, true)
);
router.post(
	'/email-address',
	emailAddressValidationRules(),
	validationErrorHandler,
	commonEmailAddressController.postEmailAddress(views, true)
);

module.exports = router;
