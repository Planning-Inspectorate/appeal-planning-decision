const express = require('express');
const {
  validators: { validationErrorHandler },
} = require('@pins/common');
const accuracySubmissionController = require('../controllers/accuracy-submission');
const fetchExistingAppealReplyMiddleware = require('../middleware/fetch-existing-appeal-reply');
const fetchAppealMiddleware = require('../middleware/fetch-appeal');
const { rules: accuracySubmissionValidationRules } = require('../validators/accuracy-submission');

const router = express.Router();

router.get(
  '/:id/accuracy-submission',
  [fetchAppealMiddleware, fetchExistingAppealReplyMiddleware],
  accuracySubmissionController.getAccuracySubmission
);

router.post(
  '/:id/accuracy-submission',
  accuracySubmissionValidationRules(),
  validationErrorHandler,
  accuracySubmissionController.postAccuracySubmission
);

module.exports = router;
