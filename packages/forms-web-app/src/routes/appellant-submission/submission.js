const express = require('express');

const fetchExistingAppealMiddleware = require('../../middleware/fetch-existing-appeal');
const submissionController = require('../../controllers/appellant-submission/submission');
const {
  validators: { validationErrorHandler },
} = require('@pins/common');
const {
  rules: submissionValidationRules,
} = require('../../validators/appellant-submission/submission');

const router = express.Router();

router.get('/submission', [fetchExistingAppealMiddleware], submissionController.getSubmission);
router.post(
  '/submission',
  submissionValidationRules(),
  validationErrorHandler,
  submissionController.postSubmission
);

module.exports = router;
