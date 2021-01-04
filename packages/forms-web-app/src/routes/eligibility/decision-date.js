const express = require('express');

const decisionDateController = require('../../controllers/eligibility/decision-date');
const { validationErrorHandler } = require('../../validators/validation-error-handler');
const {
  rules: decisionDateValidationRules,
} = require('../../validators/eligibility/decision-date');

const router = express.Router();

/* GET eligibility no decision page. */
router.get('/no-decision', decisionDateController.getNoDecision);

/* GET eligibility decision date input page. */
router.get('/decision-date', decisionDateController.getDecisionDate);

router.post(
  '/decision-date',
  decisionDateValidationRules(),
  validationErrorHandler,
  decisionDateController.postDecisionDate
);

/* GET eligibility decision date out page. */
router.get('/decision-date-expired', decisionDateController.getDecisionDateExpired);

module.exports = router;
