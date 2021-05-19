const express = require('express');

const fetchExistingAppealMiddleware = require('../../middleware/fetch-existing-appeal');
const uploadDecisionController = require('../../controllers/appellant-submission/upload-decision');
const {
  validators: { validationErrorHandler },
} = require('@pins/common');
const {
  rules: uploadDecisionValidationRules,
} = require('../../validators/appellant-submission/upload-decision');

const router = express.Router();

router.get(
  '/upload-decision',
  [fetchExistingAppealMiddleware],
  uploadDecisionController.getUploadDecision
);
router.post(
  '/upload-decision',
  uploadDecisionValidationRules(),
  validationErrorHandler,
  uploadDecisionController.postUploadDecision
);

module.exports = router;
