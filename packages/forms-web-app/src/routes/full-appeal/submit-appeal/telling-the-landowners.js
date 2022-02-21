const express = require('express');
const { STANDARD_TRIPLE_CONFIRM_OPTIONS } = require('@pins/business-rules/src/constants');
const {
  getTellingTheLandowners,
  postTellingTheLandowners,
} = require('../../../controllers/full-appeal/submit-appeal/telling-the-landowners');
const fetchExistingAppealMiddleware = require('../../../middleware/fetch-existing-appeal');
const { validationErrorHandler } = require('../../../validators/validation-error-handler');
const { buildCheckboxValidation } = require('../../../validators/common/checkboxes');

const router = express.Router();

const controllerUrl = '/submit-appeal/telling-the-landowners';

router.get(controllerUrl, [fetchExistingAppealMiddleware], getTellingTheLandowners);

const errorMessage = `Confirm if you've told the landowners`;

const checkboxValidations = buildCheckboxValidation(
  'telling-the-landowners',
  STANDARD_TRIPLE_CONFIRM_OPTIONS,
  {
    notEmptyMessage: errorMessage,
    allMandatoryMessage: errorMessage,
  }
);

router.post(controllerUrl, checkboxValidations, validationErrorHandler, postTellingTheLandowners);

module.exports = router;
