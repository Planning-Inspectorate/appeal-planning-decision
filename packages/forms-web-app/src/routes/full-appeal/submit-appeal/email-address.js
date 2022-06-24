const express = require('express');

const fetchExistingAppealMiddleware = require('../../../middleware/fetch-existing-appeal');
const emailAddressController = require('../../../controllers/full-appeal/submit-appeal/email-address');
const { validationErrorHandler } = require('../../../validators/validation-error-handler');
const {
  rules: emailAddressValidationRules,
} = require('../../../validators/full-appeal/email-address');

const router = express.Router();

router.get(
  '/submit-appeal/email-address',
  [fetchExistingAppealMiddleware],
  emailAddressController.getEmailAddress
);
router.post(
  '/submit-appeal/email-address',
  emailAddressValidationRules(),
  validationErrorHandler,
  emailAddressController.postEmailAddress
);

module.exports = router;
