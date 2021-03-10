const express = require('express');

const fetchExistingAppealMiddleware = require('../../middleware/fetch-existing-appeal');
const uploadDecisionController = require('../../controllers/appellant-submission/upload-decision');
const { validationErrorHandler } = require('../../validators/validation-error-handler');
const {
  rules: uploadDecisionValidationRules,
} = require('../../validators/appellant-submission/upload-decision');

const router = express.Router();

router.get(
  '/upload-decision-letter',
  [fetchExistingAppealMiddleware],
  uploadDecisionController.getUploadDecision
);
router.post(
  '/upload-decision-letter',
  uploadDecisionValidationRules(),
  validationErrorHandler,
  uploadDecisionController.postUploadDecision
);

module.exports = router;
