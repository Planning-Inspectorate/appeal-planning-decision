const express = require('express');
const {
  validators: { validationErrorHandler },
} = require('@pins/common');

const fetchExistingAppealMiddleware = require('../../middleware/fetch-existing-appeal');
const appealStatementController = require('../../controllers/appellant-submission/appeal-statement');
const {
  rules: appealStatementValidationRules,
} = require('../../validators/appellant-submission/appeal-statement');

const router = express.Router();

router.get(
  '/appeal-statement',
  [fetchExistingAppealMiddleware],
  appealStatementController.getAppealStatement
);
router.post(
  '/appeal-statement',
  appealStatementValidationRules(),
  validationErrorHandler,
  appealStatementController.postAppealStatement
);

module.exports = router;
