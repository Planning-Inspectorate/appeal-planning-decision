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
    fieldName: 'description-development-correct',
    emptyError:
      "Select yes if your proposed development haven't changed after you submitted your application",
  }),
  textfieldValidationRules({
    fieldName: 'description-development-correct-details',
    targetFieldName: 'description-development-correct',
    targetFieldValue: 'no',
    emptyError: 'Enter the agreed description of development',
    tooLongError: 'Agreed description of development must be $maxLength characters or less',
  }),
  validationErrorHandler,
  postProposedDevelopmentChanged
);

module.exports = router;
