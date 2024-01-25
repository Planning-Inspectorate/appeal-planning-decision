const express = require('express');

const fetchExistingAppealMiddleware = require('../../../middleware/fetch-existing-appeal');
const {
	getEmailAddress,
	postEmailAddress
} = require('../../../controllers/appeal-householder-decision/email-address');
const { validationErrorHandler } = require('../../../validators/validation-error-handler');
const {
	rules: emailAddressValidationRules
} = require('../../../validators/full-appeal/email-address');

const router = express.Router();

router.get('/email-address', [fetchExistingAppealMiddleware], getEmailAddress);
router.post(
	'/email-address',
	emailAddressValidationRules(),
	validationErrorHandler,
	postEmailAddress
);

module.exports = router;
