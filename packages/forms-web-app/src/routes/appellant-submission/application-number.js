const express = require('express');

const fetchExistingAppealMiddleware = require('../../middleware/fetch-existing-appeal');
const applicationNumberController = require('../../controllers/appellant-submission/application-number');
const { validationErrorHandler } = require('../../validators/validation-error-handler');
const {
  rules: applicationNumberValidationRules,
} = require('../../validators/appellant-submission/application-number');

const router = express.Router();

router.get(
  '/planning-application-number',
  [fetchExistingAppealMiddleware],
  applicationNumberController.getApplicationNumber
);
router.post(
  '/planning-application-number',
  applicationNumberValidationRules(),
  validationErrorHandler,
  applicationNumberController.postApplicationNumber
);

module.exports = router;
