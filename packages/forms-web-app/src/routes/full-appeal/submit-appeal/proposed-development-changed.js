const express = require('express');
const {
  getProposedDevelopmentChanged,
  postProposedDevelopmentChanged,
} = require('../../../controllers/full-appeal/submit-appeal/proposed-development-changed');
const fetchExistingAppealMiddleware = require('../../../middleware/fetch-existing-appeal');
const { validationErrorHandler } = require('../../../validators/validation-error-handler');
const { rules: optionsValidationRules } = require('../../../validators/common/options');
const { rules: textfieldValidationRules } = require('../../../validators/common/textfield');

const router = express.Router();

router.get(
  '/submit-appeal/proposed-development-changed',
  [fetchExistingAppealMiddleware],
  getProposedDevelopmentChanged
);
router.post(
  '/submit-appeal/proposed-development-changed',
  optionsValidationRules({
    fieldName: 'proposed-development-changed',
    emptyError:
      'Select yes if your proposed development changed after you submitted your application',
  }),
  textfieldValidationRules({
    fieldName: 'proposed-development-changed-details',
    targetFieldName: 'proposed-development-changed',
    targetFieldValue: 'yes',
    emptyError: 'Enter the agreed description of development',
    tooLongError: 'How proposed development changed must be $maxLength characters or less',
  }),
  validationErrorHandler,
  postProposedDevelopmentChanged
);

module.exports = router;
