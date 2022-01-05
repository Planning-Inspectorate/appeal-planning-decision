const express = require('express');

const fetchExistingAppealMiddleware = require('../../../middleware/fetch-existing-appeal');
const applicationNumberController = require('../../../controllers/full-appeal/submit-appeal/application-number');
const { validationErrorHandler } = require('../../../validators/validation-error-handler');
const {
  rules: applicationNumberValidationRules,
} = require('../../../validators/full-appeal/application-number');

const router = express.Router();

router.get(
  '/submit-appeal/application-number',
  [fetchExistingAppealMiddleware],
  applicationNumberController.getApplicationNumber
);
router.post(
  '/submit-appeal/application-number',
  applicationNumberValidationRules(),
  validationErrorHandler,
  applicationNumberController.postApplicationNumber
);

module.exports = router;
