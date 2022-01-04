const express = require('express');
const fetchExistingAppealMiddleware = require('../../../middleware/fetch-existing-appeal');
const contactDetailsController = require('../../../controllers/full-appeal/submit-appeal/contact-details');
const { rules: contactDetailsRules } = require('../../../validators/full-appeal/contact-details');
const { validationErrorHandler } = require('../../../validators/validation-error-handler');

const router = express.Router();

router.get(
  '/submit-appeal/contact-details',
  [fetchExistingAppealMiddleware],
  contactDetailsController.getContactDetails
);
router.post(
  '/submit-appeal/contact-details',
  [contactDetailsRules(), validationErrorHandler],
  contactDetailsController.postContactDetails
);

module.exports = router;
