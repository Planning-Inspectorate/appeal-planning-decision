const express = require('express');

const submissionController = require('../controllers/submission');
const { validationErrorHandler } = require('../validators/validation-error-handler');
const { rules: submissionValidationRules } = require('../validators/submission');

const router = express.Router();

router.get('/', submissionController.getSubmission);
router.post(
  '/',
  submissionValidationRules(),
  validationErrorHandler,
  submissionController.postSubmission
);

module.exports = router;
