const express = require('express');

const fetchExistingAppealMiddleware = require('../../../middleware/fetch-existing-appeal');
const {
	getAppealSiteAddress,
	postAppealSiteAddress
} = require('../../../controllers/full-appeal/submit-appeal/appeal-site-address');
const { validationErrorHandler } = require('../../../validators/validation-error-handler');
const {
	rules: appealSiteAddressValidationRules
} = require('../../../validators/full-appeal/appeal-site-address');

const router = express.Router();

router.get(
	'/submit-appeal/appeal-site-address',
	[fetchExistingAppealMiddleware],
	getAppealSiteAddress
);
router.post(
	'/submit-appeal/appeal-site-address',
	[appealSiteAddressValidationRules(), validationErrorHandler],
	postAppealSiteAddress
);

module.exports = router;
