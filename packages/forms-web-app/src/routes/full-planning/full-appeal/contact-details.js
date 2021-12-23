const express = require('express');
const fetchExistingAppealMiddleware = require('../../../middleware/fetch-existing-appeal');
const contactDetailsController = require('../../../controllers/full-planning/full-appeal/contact-details');
const { rules: contactDetailsRules } = require('../../../validators/full-planning/contact-details');
const { validationErrorHandler } = require('../../../validators/validation-error-handler');

const router = express.Router();

router.get(
  '/contact-details',
  [fetchExistingAppealMiddleware],
  contactDetailsController.getContactDetails
);
router.post(
  '/contact-details',
  [contactDetailsRules(), validationErrorHandler],
  contactDetailsController.postContactDetails
);

module.exports = router;
