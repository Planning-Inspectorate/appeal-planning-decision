const express = require('express');
const { STANDARD_TRIPLE_CONFIRM_OPTIONS } = require('@pins/business-rules/src/constants');
const {
  getAdvertisingYourAppeal,
  postAdvertisingYourAppeal,
} = require('../../../controllers/full-appeal/submit-appeal/advertising-your-appeal');
const fetchExistingAppealMiddleware = require('../../../middleware/fetch-existing-appeal');
const { validationErrorHandler } = require('../../../validators/validation-error-handler');
const { buildCheckboxValidation } = require('../../../validators/common/checkboxes');

const router = express.Router();

const controllerUrl = '/submit-appeal/advertising-your-appeal';

router.get(controllerUrl, [fetchExistingAppealMiddleware], getAdvertisingYourAppeal);

const errorMessage = `Confirm if you have advertised your appeal`;

const checkboxValidations = buildCheckboxValidation(
  'advertising-your-appeal',
  STANDARD_TRIPLE_CONFIRM_OPTIONS,
  {
    notEmptyMessage: errorMessage,
    allMandatoryMessage: errorMessage,
  }
);

router.post(controllerUrl, checkboxValidations, validationErrorHandler, postAdvertisingYourAppeal);

module.exports = router;
