const express = require('express');

const submissionController = require('../../controllers/appellant-submission/submission');
const { validationErrorHandler } = require('../../validators/validation-error-handler');
const {
  rules: submissionValidationRules,
} = require('../../validators/appellant-submission/submission');

const router = express.Router();

router.get('/submission', submissionController.getSubmission);
router.post(
  '/submission',
  submissionValidationRules(),
  validationErrorHandler,
  submissionController.postSubmission
);

module.exports = router;
