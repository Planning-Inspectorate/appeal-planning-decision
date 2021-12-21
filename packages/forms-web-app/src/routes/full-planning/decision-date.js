const express = require('express');

const fetchExistingAppealMiddleware = require('../../middleware/fetch-existing-appeal');
const decisionDateController = require('../../controllers/full-planning/decision-date');
const {
  rules: decisionDateValidationRules,
} = require('../../validators/full-planning/decision-date');
const { validationErrorHandler } = require('../../validators/validation-error-handler');

const router = express.Router();

router.get(
  '/decision-date',
  [fetchExistingAppealMiddleware],
  decisionDateController.getDecisionDate
);

router.post(
  '/decision-date',
  decisionDateValidationRules(),
  validationErrorHandler,
  decisionDateController.postDecisionDate
);

module.exports = router;
