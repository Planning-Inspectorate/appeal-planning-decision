const express = require('express');
const {
  getHealthSafetyIssues,
  postHealthSafetyIssues,
} = require('../../../controllers/full-appeal/submit-appeal/health-safety-issues');
const fetchExistingAppealMiddleware = require('../../../middleware/fetch-existing-appeal');
const { validationErrorHandler } = require('../../../validators/validation-error-handler');
const { rules: optionsValidationRules } = require('../../../validators/common/options');
const {
  rules: conditionalTextValidationRules,
} = require('../../../validators/common/conditional-text');

const router = express.Router();

router.get(
  '/submit-appeal/health-safety-issues',
  [fetchExistingAppealMiddleware],
  getHealthSafetyIssues
);
router.post(
  '/submit-appeal/health-safety-issues',
  optionsValidationRules({
    fieldName: 'health-safety-issues',
    emptyError: 'Select yes if there are any health and safety issues on the appeal site',
  }),
  conditionalTextValidationRules({
    fieldName: 'health-safety-issues-details',
    targetFieldName: 'health-safety-issues',
    targetFieldValue: 'yes',
    emptyError: 'Tell us about the health and safety issues',
    tooLongError: 'Health and safety information must be $maxLength characters or less',
  }),
  validationErrorHandler,
  postHealthSafetyIssues
);

module.exports = router;
