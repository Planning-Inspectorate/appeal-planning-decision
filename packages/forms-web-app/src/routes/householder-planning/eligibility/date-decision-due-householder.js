const express = require('express');

const fetchExistingAppealMiddleware = require('../../../middleware/fetch-existing-appeal');
const dateDecisionDueHouseholderController = require('../../../controllers/householder-planning/eligibility/date-decision-due-householder');
const {
  rules: dateDecisionDueHouseholderValidationRules,
} = require('../../../validators/householder-planning/eligibility/date-decision-due-householder');
const { validationErrorHandler } = require('../../../validators/validation-error-handler');

const router = express.Router();

router.get(
  '/date-decision-due-householder',
  [fetchExistingAppealMiddleware],
  dateDecisionDueHouseholderController.getDateDecisionDueHouseholder
);

router.post(
  '/date-decision-due-householder',
  dateDecisionDueHouseholderValidationRules(),
  validationErrorHandler,
  dateDecisionDueHouseholderController.postDateDecisionDueHouseholder
);

module.exports = router;
